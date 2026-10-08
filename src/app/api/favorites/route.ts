import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError('Please login to view saved properties', 'UNAUTHORIZED', 401);
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      property: {
        include: {
          images: { where: { isCover: true } },
          developer: { select: { name: true, verified: true } },
        },
      },
      project: {
        include: {
          images: { where: { isCover: true } },
          developer: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return apiSuccess(favorites);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError('Please login to save properties', 'UNAUTHORIZED', 401);
  }

  const body = await req.json();
  const { propertyId, projectId } = body;

  if (!propertyId && !projectId) {
    return apiError('propertyId or projectId is required', 'VALIDATION_ERROR', 400);
  }

  // Check if existing
  const existing = await prisma.favorite.findFirst({
    where: {
      userId: user.id,
      ...(propertyId ? { propertyId } : {}),
      ...(projectId ? { projectId } : {}),
    },
  });

  if (existing) {
    // Toggle off
    await prisma.favorite.delete({ where: { id: existing.id } });
    return apiSuccess({ isFavorite: false, message: 'Removed from favorites' });
  }

  const created = await prisma.favorite.create({
    data: {
      userId: user.id,
      propertyId: propertyId || null,
      projectId: projectId || null,
    },
  });

  return apiSuccess({ isFavorite: true, favorite: created });
}
