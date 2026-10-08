import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'EDITOR'])) {
      return apiError('Unauthorized to view leads', 'FORBIDDEN', 403);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const agentId = searchParams.get('agentId');
    const search = searchParams.get('search')?.trim();

    const where: any = {};

    // If agent, limit to their assigned leads unless Super Admin / Admin
    if (user.role === 'AGENT') {
      const agentProfile = await prisma.agent.findFirst({
        where: { userId: user.id },
      });
      if (agentProfile) {
        where.assignedAgentId = agentProfile.id;
      }
    } else if (agentId) {
      where.assignedAgentId = agentId;
    }

    if (status && status !== 'ALL') {
      where.status = status.toUpperCase();
    }

    if (priority && priority !== 'ALL') {
      where.priority = priority.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { leadId: { contains: search } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: { id: true, propertyId: true, title: true, priceDisplay: true, locality: true },
          },
          project: {
            select: { id: true, projectId: true, name: true, location: true },
          },
          assignedAgent: {
            select: { id: true, name: true, phone: true, employeeId: true },
          },
          _count: {
            select: { notes: true },
          },
        },
      }),
    ]);

    return apiSuccess(leads, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Admin leads fetch error:', error);
    return apiError('Failed to fetch leads', 'FETCH_FAILED', 500);
  }
}
