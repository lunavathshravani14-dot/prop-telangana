import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'AGENT'])) {
      return apiError('Unauthorized', 'FORBIDDEN', 403);
    }

    const { id } = params;
    const lead = await prisma.lead.findFirst({
      where: { OR: [{ id }, { leadId: id }] },
      include: {
        property: true,
        project: true,
        assignedAgent: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      return apiError('Lead not found', 'NOT_FOUND', 404);
    }

    return apiSuccess(lead);
  } catch (error: any) {
    console.error('Lead fetch error:', error);
    return apiError('Failed to fetch lead details', 'FETCH_FAILED', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'AGENT'])) {
      return apiError('Unauthorized', 'FORBIDDEN', 403);
    }

    const { id } = params;
    const body = await req.json();
    const { status, priority, assignedAgentId, nextFollowUp, note } = body;

    const lead = await prisma.lead.findFirst({
      where: { OR: [{ id }, { leadId: id }] },
    });

    if (!lead) {
      return apiError('Lead not found', 'NOT_FOUND', 404);
    }

    const oldStatus = lead.status;
    const newStatus = status ? status.toUpperCase() : oldStatus;

    const updated = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: newStatus,
        ...(priority ? { priority: priority.toUpperCase() } : {}),
        ...(assignedAgentId !== undefined ? { assignedAgentId } : {}),
        ...(nextFollowUp ? { nextFollowUp: new Date(nextFollowUp) } : {}),
      },
      include: {
        assignedAgent: true,
      },
    });

    // If status changed, record in history
    if (newStatus !== oldStatus) {
      await prisma.leadStatusHistory.create({
        data: {
          leadId: lead.id,
          oldStatus,
          newStatus,
          changedById: user.id,
          remarks: note || `Status updated to ${newStatus} by ${user.name}`,
        },
      });
    }

    // If note added
    if (note && note.trim()) {
      await prisma.leadNote.create({
        data: {
          leadId: lead.id,
          authorId: user.id,
          authorName: user.name,
          note: note.trim(),
        },
      });
    }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'STATUS_CHANGE',
      entity: 'LEAD',
      entityId: lead.id,
      metadata: { oldStatus, newStatus, assignedAgentId },
    });

    return apiSuccess(updated);
  } catch (error: any) {
    console.error('Lead update error:', error);
    return apiError('Failed to update lead', 'UPDATE_FAILED', 500);
  }
}
