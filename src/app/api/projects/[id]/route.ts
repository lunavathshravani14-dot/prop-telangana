import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { projectId: id }],
      },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        videos: true,
        documents: true,
        developer: true,
        properties: {
          where: { status: 'PUBLISHED' },
          include: {
            images: { where: { isCover: true } },
          },
        },
      },
    });

    if (!project) {
      return apiError('Project not found', 'NOT_FOUND', 404);
    }

    return apiSuccess(project);
  } catch (error: any) {
    console.error('Project details fetch error:', error);
    return apiError('Failed to fetch project details', 'FETCH_FAILED', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
      return apiError('Unauthorized to update projects', 'FORBIDDEN', 403);
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }, { projectId: id }] },
    });

    if (!existing) {
      return apiError('Project not found', 'NOT_FOUND', 404);
    }

    const {
      name,
      description,
      developerId,
      location,
      city,
      district,
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
      status,
      featured,
      images,
    } = body;

    const updated = await prisma.project.update({
      where: { id: existing.id },
      data: {
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        ...(developerId !== undefined ? { developerId: developerId || null } : {}),
        ...(location ? { location } : {}),
        ...(city ? { city } : {}),
        ...(district ? { district } : {}),
        ...(projectType ? { projectType: projectType.toUpperCase() } : {}),
        ...(totalArea !== undefined ? { totalArea } : {}),
        ...(totalUnits !== undefined ? { totalUnits } : {}),
        ...(plotSizes !== undefined ? { plotSizes } : {}),
        ...(villaSizes !== undefined ? { villaSizes } : {}),
        ...(apartmentSizes !== undefined ? { apartmentSizes } : {}),
        ...(minPrice !== undefined ? { minPrice: minPrice ? parseFloat(minPrice) : null } : {}),
        ...(maxPrice !== undefined ? { maxPrice: maxPrice ? parseFloat(maxPrice) : null } : {}),
        ...(priceRange !== undefined ? { priceRange } : {}),
        ...(possessionDate !== undefined ? { possessionDate } : {}),
        ...(reraNumber !== undefined ? { reraNumber } : {}),
        ...(approvalDetails !== undefined ? { approvalDetails } : {}),
        ...(connectivity !== undefined ? { connectivity } : {}),
        ...(amenitiesList !== undefined ? { amenitiesList } : {}),
        ...(brochureUrl !== undefined ? { brochureUrl } : {}),
        ...(latitude !== undefined ? { latitude: latitude ? parseFloat(latitude) : null } : {}),
        ...(longitude !== undefined ? { longitude: longitude ? parseFloat(longitude) : null } : {}),
        ...(contactPhone !== undefined ? { contactPhone } : {}),
        ...(contactEmail !== undefined ? { contactEmail } : {}),
        ...(status ? { status: status.toUpperCase() } : {}),
        ...(featured !== undefined ? { featured: Boolean(featured) } : {}),
      },
    });

    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.projectImage.deleteMany({ where: { projectId: existing.id } });
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.projectImage.create({
          data: {
            projectId: existing.id,
            url: typeof img === 'string' ? img : img.url,
            isCover: i === 0,
            orderIndex: i,
            altText: updated.name,
          },
        });
      }
    }

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'UPDATE',
      entity: 'PROJECT',
      entityId: existing.id,
      metadata: { name: updated.name },
    });

    return apiSuccess(updated);
  } catch (error: any) {
    console.error('Project update error:', error);
    return apiError('Failed to update project', 'UPDATE_FAILED', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
      return apiError('Unauthorized to delete projects', 'FORBIDDEN', 403);
    }

    const { id } = params;
    const existing = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }, { projectId: id }] },
    });

    if (!existing) {
      return apiError('Project not found', 'NOT_FOUND', 404);
    }

    await prisma.project.delete({
      where: { id: existing.id },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'DELETE',
      entity: 'PROJECT',
      entityId: existing.id,
      metadata: { name: existing.name },
    });

    return apiSuccess({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Project delete error:', error);
    return apiError('Failed to delete project', 'DELETE_FAILED', 500);
  }
}
