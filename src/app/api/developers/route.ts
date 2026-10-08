import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const verified = searchParams.get('verified');

    const where: any = {};
    if (verified === 'true') {
      where.verified = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const developers = await prisma.developer.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            properties: true,
            projects: true,
          },
        },
      },
    });

    return apiSuccess(developers);
  } catch (error: any) {
    console.error('Developers list error:', error);
    return apiError('Failed to fetch developers', 'FETCH_FAILED', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
      return apiError('Unauthorized to create developers', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const {
      name,
      logo,
      coverImage,
      description,
      website,
      phone,
      email,
      officeAddress,
      experienceYears,
      verified = true,
      reraRegistered = true,
      socialLinks,
    } = body;

    if (!name) {
      return apiError('Developer name is required', 'VALIDATION_ERROR', 400);
    }

    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const slug = `${baseSlug}-${randomSuffix}`;

    const newDev = await prisma.developer.create({
      data: {
        name,
        slug,
        logo,
        coverImage,
        description,
        website,
        phone,
        email,
        officeAddress,
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : 0,
        verified: Boolean(verified),
        reraRegistered: Boolean(reraRegistered),
        socialLinks: typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : socialLinks,
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'CREATE',
      entity: 'DEVELOPER',
      entityId: newDev.id,
      metadata: { name },
    });

    return apiSuccess(newDev, undefined, 201);
  } catch (error: any) {
    console.error('Developer creation error:', error);
    return apiError('Failed to create developer', 'CREATE_FAILED', 500);
  }
}
