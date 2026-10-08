import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;

    const search = searchParams.get('search')?.trim();
    const city = searchParams.get('city');
    const projectType = searchParams.get('projectType');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const developerId = searchParams.get('developerId');

    const where: any = {};

    if (featured === 'true') {
      where.featured = true;
    }

    if (city) {
      where.city = { contains: city };
    }

    if (projectType) {
      where.projectType = projectType.toUpperCase();
    }

    if (status && status !== 'ALL') {
      where.status = status.toUpperCase();
    }

    if (developerId) {
      where.developerId = developerId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { orderIndex: 'asc' } },
          developer: { select: { id: true, name: true, slug: true, logo: true, verified: true } },
          _count: {
            select: { properties: true },
          },
        },
      }),
    ]);

    return apiSuccess(projects, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Projects list error:', error);
    return apiError('Failed to fetch projects', 'FETCH_FAILED', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
      return apiError('Unauthorized to create projects', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const {
      name,
      description,
      developerId,
      location,
      city = 'Hyderabad',
      district = 'Hyderabad',
      projectType,
      totalArea,
      totalUnits,
      plotSizes,
      villaSizes,
      apartmentSizes,
      minPrice,
      maxPrice,
      priceRange,
      possessionDate,
      reraNumber,
      approvalDetails,
      connectivity,
      amenitiesList,
      brochureUrl,
      latitude,
      longitude,
      contactPhone,
      contactEmail,
      status = 'ONGOING',
      featured = false,
      images = [],
    } = body;

    if (!name || !description || !location || !projectType) {
      return apiError('Name, description, location, and project type are required', 'VALIDATION_ERROR', 400);
    }

    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    const prjCount = await prisma.project.count();
    const projectId = `PT-PRJ-${2000 + prjCount + 1}`;

    const newProject = await prisma.project.create({
      data: {
        projectId,
        name,
        slug,
        description,
        developerId: developerId || null,
        location,
        city,
        district,
        projectType: projectType.toUpperCase(),
        totalArea,
        totalUnits,
        plotSizes,
        villaSizes,
        apartmentSizes,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        priceRange: priceRange || (minPrice ? `₹ ${minPrice}` : undefined),
        possessionDate,
        reraNumber,
        approvalDetails,
        connectivity,
        amenitiesList,
        brochureUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        contactPhone,
        contactEmail,
        status: status.toUpperCase(),
        featured: Boolean(featured),
        images: {
          create: images.map((img: any, idx: number) => ({
            url: typeof img === 'string' ? img : img.url,
            isCover: idx === 0,
            orderIndex: idx,
            altText: name,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'CREATE',
      entity: 'PROJECT',
      entityId: newProject.id,
      metadata: { name, projectId },
    });

    return apiSuccess(newProject, undefined, 201);
  } catch (error: any) {
    console.error('Project creation error:', error);
    return apiError('Failed to create project', 'CREATE_FAILED', 500);
  }
}
