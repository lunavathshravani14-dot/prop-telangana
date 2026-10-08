import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'AGENT'])) {
      return apiError('Unauthorized', 'FORBIDDEN', 403);
    }

    const agents = await prisma.agent.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { properties: true, leads: true },
        },
      },
    });

    return apiSuccess(agents);
  } catch (error: any) {
    console.error('Agents list error:', error);
    return apiError('Failed to fetch agents', 'FETCH_FAILED', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
      return apiError('Unauthorized', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const { name, email, phone, designation, photo, bio, reraNumber } = body;

    if (!name || !email || !phone) {
      return apiError('Name, email, and phone are required', 'VALIDATION_ERROR', 400);
    }

    const count = await prisma.agent.count();
    const employeeId = `PT-AGT-${String(count + 1).padStart(2, '0')}`;

    const newAgent = await prisma.agent.create({
      data: {
        employeeId,
        name,
        email: email.toLowerCase().trim(),
        phone,
        designation: designation || 'Property Advisor',
        photo,
        bio,
        reraNumber,
        status: 'ACTIVE',
      },
    });

    return apiSuccess(newAgent, undefined, 201);
  } catch (error: any) {
    console.error('Agent create error:', error);
    return apiError('Failed to create agent', 'CREATE_FAILED', 500);
  }
}
