import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      propertyId,
      projectId,
      message,
      source = 'WEBSITE',
      utmSource,
      utmMedium,
      utmCampaign,
      pageUrl,
      // Honeypot field for anti-spam
      website_honeypot,
    } = body;

    // Anti-spam honeypot detection
    if (website_honeypot) {
      return apiSuccess({ message: 'Thank you for your interest. Our advisor will reach out shortly.' });
    }

    if (!name || !phone) {
      return apiError('Name and phone number are required', 'VALIDATION_ERROR', 400);
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '').trim();
    if (cleanPhone.length < 8) {
      return apiError('Please enter a valid phone number', 'VALIDATION_ERROR', 400);
    }

    // Check duplicate spam submission within last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentDuplicate = await prisma.lead.findFirst({
      where: {
        phone: cleanPhone,
        createdAt: { gte: fiveMinutesAgo },
        ...(propertyId ? { propertyId } : {}),
      },
    });

    if (recentDuplicate) {
      return apiSuccess({
        leadId: recentDuplicate.leadId,
        message: 'Your enquiry was already received. An advisor is already reviewing it!',
      });
    }

    // Generate formatted lead ID
    const leadCount = await prisma.lead.count();
    const leadId = `PT-LD-${1000 + leadCount + 1}`;

    // Auto-assign agent if property has dedicated agent
    let assignedAgentId = null;
    if (propertyId) {
      const prop = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { agentId: true },
      });
      if (prop?.agentId) {
        assignedAgentId = prop.agentId;
      }
    }

    // If still no agent, assign first active agent
    if (!assignedAgentId) {
      const firstAgent = await prisma.agent.findFirst({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });
      if (firstAgent) assignedAgentId = firstAgent.id;
    }

    const newLead = await prisma.lead.create({
      data: {
        leadId,
        name: name.trim(),
        phone: cleanPhone,
        email: email ? email.toLowerCase().trim() : null,
        propertyId: propertyId || null,
        projectId: projectId || null,
        message: message ? message.trim() : null,
        source,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        pageUrl: pageUrl || null,
        assignedAgentId,
        status: 'NEW',
        priority: 'MEDIUM',
      },
      include: {
        property: { select: { title: true, propertyId: true } },
        project: { select: { name: true, projectId: true } },
      },
    });

    // Record initial status in status history
    await prisma.leadStatusHistory.create({
      data: {
        leadId: newLead.id,
        newStatus: 'NEW',
        remarks: 'Lead generated via website form submission',
      },
    });

    // Create system notification for admins
    await prisma.notification.create({
      data: {
        title: `New Enquiry: ${leadId}`,
        message: `${name} enquired about ${newLead.property?.title || newLead.project?.name || 'General Inquiry'} (${cleanPhone})`,
        type: 'LEAD',
        link: `/admin/leads`,
      },
    });

    return apiSuccess(
      {
        leadId: newLead.leadId,
        message: 'Thank you! Your enquiry has been received. Our luxury property specialist will contact you shortly.',
      },
      undefined,
      201
    );
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return apiError('Failed to process enquiry. Please try again or call us directly.', 'SUBMISSION_FAILED', 500);
  }
}
