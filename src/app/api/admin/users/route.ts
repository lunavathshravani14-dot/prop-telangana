import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
      return apiError('Unauthorized', 'FORBIDDEN', 403);
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    return apiSuccess(users);
  } catch (error: any) {
    console.error('Users list error:', error);
    return apiError('Failed to fetch users', 'FETCH_FAILED', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN'])) {
      return apiError('Only Super Admin can modify user roles and statuses', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const { userId, role, status } = body;

    if (!userId) {
      return apiError('userId is required', 'VALIDATION_ERROR', 400);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role ? { role: role.toUpperCase() } : {}),
        ...(status ? { status: status.toUpperCase() } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'UPDATE',
      entity: 'USER',
      entityId: userId,
      metadata: { role, status },
    });

    return apiSuccess(updated);
  } catch (error: any) {
    console.error('User update error:', error);
    return apiError('Failed to update user', 'UPDATE_FAILED', 500);
  }
}
