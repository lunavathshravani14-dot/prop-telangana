import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const popular = searchParams.get('popular');

    const where: any = {};
    if (type) {
      where.type = type.toUpperCase();
    }
    if (popular === 'true') {
      where.popular = true;
    }

    const locations = await prisma.location.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        children: {
          select: { id: true, name: true, slug: true, type: true, avgPriceSqft: true },
        },
        _count: {
          select: { properties: true, projects: true },
        },
      },
    });

    return apiSuccess(locations);
  } catch (error: any) {
    console.error('Locations fetch error:', error);
    return apiError('Failed to fetch locations', 'FETCH_FAILED', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
      return apiError('Unauthorized to create locations', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const { name, type = 'LOCALITY', parentId, description, coverImage, avgPriceSqft, popular, latitude, longitude } = body;

    if (!name) {
      return apiError('Location name is required', 'VALIDATION_ERROR', 400);
    }

    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const slug = `${baseSlug}-${randomSuffix}`;

    const newLoc = await prisma.location.create({
      data: {
        name,
        slug,
        type: type.toUpperCase(),
        parentId: parentId || null,
        description,
        coverImage,
        avgPriceSqft: avgPriceSqft ? parseFloat(avgPriceSqft) : null,
        popular: Boolean(popular),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });

    return apiSuccess(newLoc, undefined, 201);
  } catch (error: any) {
    console.error('Location creation error:', error);
    return apiError('Failed to create location', 'CREATE_FAILED', 500);
  }
}
