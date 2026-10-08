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
    const listingType = searchParams.get('listingType');
    const propertyType = searchParams.get('propertyType');
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const bedrooms = searchParams.get('bedrooms');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const minArea = searchParams.get('minArea') ? parseFloat(searchParams.get('minArea')!) : undefined;
    const maxArea = searchParams.get('maxArea') ? parseFloat(searchParams.get('maxArea')!) : undefined;
    const furnishing = searchParams.get('furnishing');
    const possessionStatus = searchParams.get('possessionStatus');
    const developerId = searchParams.get('developerId');
    const status = searchParams.get('status') || 'PUBLISHED';
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {};

    // In public listing, default to PUBLISHED unless admin requests all
    if (status !== 'ALL') {
      where.status = status;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (listingType) {
      where.listingType = listingType.toUpperCase();
    }

    if (propertyType) {
      where.propertyType = propertyType.toUpperCase();
    }

    if (city) {
      where.city = { contains: city };
    }

    if (locality) {
      where.locality = { contains: locality };
    }

    if (bedrooms) {
      const beds = parseInt(bedrooms, 10);
      if (beds >= 4) {
        where.bedrooms = { gte: 4 };
      } else {
        where.bedrooms = beds;
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (minArea !== undefined || maxArea !== undefined) {
      where.area = {};
      if (minArea !== undefined) where.area.gte = minArea;
      if (maxArea !== undefined) where.area.lte = maxArea;
    }

    if (furnishing) {
      where.furnishing = furnishing.toUpperCase();
    }

    if (possessionStatus) {
      where.possessionStatus = possessionStatus.toUpperCase();
    }

    if (developerId) {
      where.developerId = developerId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { locality: { contains: search } },
        { city: { contains: search } },
        { address: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'area_asc') orderBy = { area: 'asc' };
    if (sort === 'area_desc') orderBy = { area: 'desc' };
    if (sort === 'views') orderBy = { viewsCount: 'desc' };

    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: {
            orderBy: { orderIndex: 'asc' },
          },
          developer: {
            select: { id: true, name: true, slug: true, logo: true, verified: true },
          },
          agent: {
            select: { id: true, name: true, phone: true, photo: true, designation: true },
          },
          amenities: {
            include: {
              amenity: true,
            },
          },
        },
      }),
    ]);

    return apiSuccess(properties, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Properties fetch error:', error);
    return apiError('Failed to fetch properties', 'FETCH_FAILED', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
      return apiError('Unauthorized to create properties', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const {
      title,
      description,
      propertyType,
      listingType = 'BUY',
      price,
      priceDisplay,
      area,
      areaUnit = 'sqft',
      bedrooms,
      bathrooms,
      balconies,
      floor,
      totalFloors,
      facing,
      furnishing = 'UNFURNISHED',
      possessionStatus = 'READY_TO_MOVE',
      constructionStatus,
      reraNumber,
      approvalInfo,
      address,
      locality,
      city = 'Hyderabad',
      district = 'Hyderabad',
      state = 'Telangana',
      pincode,
      latitude,
      longitude,
      developerId,
      agentId,
      projectId,
      locationId,
      status = 'PUBLISHED',
      featured = false,
      images = [],
      amenityIds = [],
    } = body;

    if (!title || !description || !propertyType || !price || !area || !address || !locality) {
      return apiError('Missing required property fields', 'VALIDATION_ERROR', 400);
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Generate readable Property ID
    const propCount = await prisma.property.count();
    const propertyId = `PT-PROP-${1000 + propCount + 1}`;

    const newProperty = await prisma.property.create({
      data: {
        propertyId,
        title,
        slug,
        description,
        propertyType: propertyType.toUpperCase(),
        listingType: listingType.toUpperCase(),
        price: parseFloat(price),
        priceDisplay: priceDisplay || `₹ ${price}`,
        area: parseFloat(area),
        areaUnit,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
        balconies: balconies ? parseInt(balconies, 10) : null,
        floor: floor ? parseInt(floor, 10) : null,
        totalFloors: totalFloors ? parseInt(totalFloors, 10) : null,
        facing,
        furnishing: furnishing.toUpperCase(),
        possessionStatus: possessionStatus.toUpperCase(),
        constructionStatus,
        reraNumber,
        approvalInfo,
        address,
        locality,
        city,
        district,
        state,
        pincode,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        developerId: developerId || null,
        agentId: agentId || null,
        projectId: projectId || null,
        locationId: locationId || null,
        status,
        featured: Boolean(featured),
        images: {
          create: images.map((img: any, idx: number) => ({
            url: typeof img === 'string' ? img : img.url,
            isCover: idx === 0,
            orderIndex: idx,
            altText: title,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    // Attach amenities if provided
    if (amenityIds && amenityIds.length > 0) {
      for (const amenityId of amenityIds) {
        await prisma.propertyAmenity.create({
          data: {
            propertyId: newProperty.id,
            amenityId,
          },
        });
      }
    }

    // Log admin action
    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'CREATE',
      entity: 'PROPERTY',
      entityId: newProperty.id,
      metadata: { title, propertyId, price },
    });

    return apiSuccess(newProperty, undefined, 201);
  } catch (error: any) {
    console.error('Property creation error:', error);
    return apiError('Failed to create property', 'CREATE_FAILED', 500);
  }
}
