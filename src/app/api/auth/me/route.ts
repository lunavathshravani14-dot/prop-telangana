import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError('Not authenticated', 'UNAUTHORIZED', 401);
  }
  return apiSuccess({ user });
}

export async function PUT(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return apiError('Not authenticated', 'UNAUTHORIZED', 401);
  }

  try {
    const body = await req.json();
    const { name, phone, avatar } = body;

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(phone !== undefined ? { phone: phone?.trim() } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });

    return apiSuccess({ user: updated });
  } catch (error: any) {
    return apiError('Failed to update profile', 'UPDATE_FAILED', 500);
  }
}
