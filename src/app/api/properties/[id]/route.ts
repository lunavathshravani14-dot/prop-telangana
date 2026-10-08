import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const property = await prisma.property.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { propertyId: id }],
      },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        videos: true,
        documents: true,
        developer: true,
        agent: true,
        project: {
          include: {
            developer: true,
          },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
        locationRef: true,
      },
    });

    if (!property) {
      return apiError('Property not found', 'NOT_FOUND', 404);
    }

    // Increment view count asynchronously
    prisma.property
      .update({
        where: { id: property.id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch((err) => console.error('View increment error', err));

    // Fetch similar properties in same locality or property type
    const similarProperties = await prisma.property.findMany({
      where: {
        id: { not: property.id },
        status: 'PUBLISHED',
        OR: [{ locality: property.locality }, { propertyType: property.propertyType }],
      },
      take: 4,
      include: {
        images: { where: { isCover: true } },
        developer: { select: { name: true, verified: true } },
      },
    });

    return apiSuccess({
      property,
      similarProperties,
    });
  } catch (error: any) {
    console.error('Property fetch error:', error);
    return apiError('Failed to fetch property details', 'FETCH_FAILED', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
      return apiError('Unauthorized to update properties', 'FORBIDDEN', 403);
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.property.findFirst({
      where: { OR: [{ id }, { slug: id }, { propertyId: id }] },
    });

    if (!existing) {
      return apiError('Property not found', 'NOT_FOUND', 404);
    }

    const {
      title,
      description,
      propertyType,
      listingType,
      price,
      priceDisplay,
      area,
      areaUnit,
      bedrooms,
      bathrooms,
      balconies,
      floor,
      totalFloors,
      facing,
      furnishing,
      possessionStatus,
      constructionStatus,
      reraNumber,
      approvalInfo,
      address,
      locality,
      city,
      district,
      state,
      pincode,
      latitude,
      longitude,
      developerId,
      agentId,
      projectId,
      status,
      featured,
      images,
      amenityIds,
    } = body;

    const updated = await prisma.property.update({
      where: { id: existing.id },
      data: {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(propertyType ? { propertyType: propertyType.toUpperCase() } : {}),
        ...(listingType ? { listingType: listingType.toUpperCase() } : {}),
        ...(price !== undefined ? { price: parseFloat(price) } : {}),
        ...(priceDisplay !== undefined ? { priceDisplay } : {}),
        ...(area !== undefined ? { area: parseFloat(area) } : {}),
        ...(areaUnit !== undefined ? { areaUnit } : {}),
        ...(bedrooms !== undefined ? { bedrooms: bedrooms ? parseInt(bedrooms, 10) : null } : {}),
        ...(bathrooms !== undefined ? { bathrooms: bathrooms ? parseInt(bathrooms, 10) : null } : {}),
        ...(balconies !== undefined ? { balconies: balconies ? parseInt(balconies, 10) : null } : {}),
        ...(floor !== undefined ? { floor: floor ? parseInt(floor, 10) : null } : {}),
        ...(totalFloors !== undefined ? { totalFloors: totalFloors ? parseInt(totalFloors, 10) : null } : {}),
        ...(facing !== undefined ? { facing } : {}),
        ...(furnishing !== undefined ? { furnishing: furnishing.toUpperCase() } : {}),
        ...(possessionStatus !== undefined ? { possessionStatus: possessionStatus.toUpperCase() } : {}),
        ...(constructionStatus !== undefined ? { constructionStatus } : {}),
        ...(reraNumber !== undefined ? { reraNumber } : {}),
        ...(approvalInfo !== undefined ? { approvalInfo } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(locality !== undefined ? { locality } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(district !== undefined ? { district } : {}),
        ...(state !== undefined ? { state } : {}),
        ...(pincode !== undefined ? { pincode } : {}),
        ...(latitude !== undefined ? { latitude: latitude ? parseFloat(latitude) : null } : {}),
        ...(longitude !== undefined ? { longitude: longitude ? parseFloat(longitude) : null } : {}),
        ...(developerId !== undefined ? { developerId: developerId || null } : {}),
        ...(agentId !== undefined ? { agentId: agentId || null } : {}),
        ...(projectId !== undefined ? { projectId: projectId || null } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(featured !== undefined ? { featured: Boolean(featured) } : {}),
      },
    });

    // If new images provided
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.propertyImage.deleteMany({ where: { propertyId: existing.id } });
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.propertyImage.create({
          data: {
            propertyId: existing.id,
            url: typeof img === 'string' ? img : img.url,
            isCover: i === 0,
            orderIndex: i,
            altText: updated.title,
          },
        });
      }
    }

    // If amenities updated
    if (amenityIds && Array.isArray(amenityIds)) {
      await prisma.propertyAmenity.deleteMany({ where: { propertyId: existing.id } });
      for (const amenityId of amenityIds) {
        await prisma.propertyAmenity.create({
          data: {
            propertyId: existing.id,
            amenityId,
          },
        });
      }
    }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'UPDATE',
      entity: 'PROPERTY',
      entityId: existing.id,
      metadata: { changes: Object.keys(body) },
    });

    return apiSuccess(updated);
  } catch (error: any) {
    console.error('Property update error:', error);
    return apiError('Failed to update property', 'UPDATE_FAILED', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
      return apiError('Unauthorized to delete properties', 'FORBIDDEN', 403);
    }

    const { id } = params;
    const existing = await prisma.property.findFirst({
      where: { OR: [{ id }, { slug: id }, { propertyId: id }] },
    });

    if (!existing) {
      return apiError('Property not found', 'NOT_FOUND', 404);
    }

    // Unlink any associated leads so foreign key constraint does not fail
    await prisma.lead.updateMany({
      where: { propertyId: existing.id },
      data: { propertyId: null },
    });

    await prisma.property.delete({
      where: { id: existing.id },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'DELETE',
      entity: 'PROPERTY',
      entityId: existing.id,
      metadata: { title: existing.title, propertyId: existing.propertyId },
    });

    return apiSuccess({ message: 'Property deleted successfully' });
  } catch (error: any) {
    console.error('Property delete error:', error);
    return apiError('Failed to delete property', 'DELETE_FAILED', 500);
  }
}
