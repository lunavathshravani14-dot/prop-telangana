import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
      return apiError('Unauthorized', 'FORBIDDEN', 403);
    }

    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(logs);
  } catch (error: any) {
    console.error('Audit logs error:', error);
    return apiError('Failed to fetch audit logs', 'FETCH_FAILED', 500);
  }
}
