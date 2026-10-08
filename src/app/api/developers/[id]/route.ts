import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const developer = await prisma.developer.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        projects: {
          include: {
            images: { where: { isCover: true } },
          },
        },
        properties: {
          where: { status: 'PUBLISHED' },
          include: {
            images: { where: { isCover: true } },
          },
        },
      },
    });

    if (!developer) {
      return apiError('Developer not found', 'NOT_FOUND', 404);
    }

    return apiSuccess(developer);
  } catch (error: any) {
    console.error('Developer fetch error:', error);
    return apiError('Failed to fetch developer details', 'FETCH_FAILED', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
      return apiError('Unauthorized to update developers', 'FORBIDDEN', 403);
    }

    const { id } = params;
    const body = await req.json();

    const existing = await prisma.developer.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return apiError('Developer not found', 'NOT_FOUND', 404);
    }

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
      verified,
      reraRegistered,
      socialLinks,
    } = body;

    const updated = await prisma.developer.update({
      where: { id: existing.id },
      data: {
        ...(name ? { name } : {}),
        ...(logo !== undefined ? { logo } : {}),
        ...(coverImage !== undefined ? { coverImage } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(officeAddress !== undefined ? { officeAddress } : {}),
        ...(experienceYears !== undefined ? { experienceYears: parseInt(experienceYears, 10) } : {}),
        ...(verified !== undefined ? { verified: Boolean(verified) } : {}),
        ...(reraRegistered !== undefined ? { reraRegistered: Boolean(reraRegistered) } : {}),
        ...(socialLinks !== undefined ? { socialLinks: typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : socialLinks } : {}),
      },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'UPDATE',
      entity: 'DEVELOPER',
      entityId: existing.id,
      metadata: { name: updated.name },
    });

    return apiSuccess(updated);
  } catch (error: any) {
    console.error('Developer update error:', error);
    return apiError('Failed to update developer', 'UPDATE_FAILED', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN'])) {
      return apiError('Unauthorized to delete developers', 'FORBIDDEN', 403);
    }

    const { id } = params;
    const existing = await prisma.developer.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return apiError('Developer not found', 'NOT_FOUND', 404);
    }

    await prisma.developer.delete({
      where: { id: existing.id },
    });

    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'DELETE',
      entity: 'DEVELOPER',
      entityId: existing.id,
      metadata: { name: existing.name },
    });

    return apiSuccess({ message: 'Developer deleted successfully' });
  } catch (error: any) {
    console.error('Developer delete error:', error);
    return apiError('Failed to delete developer', 'DELETE_FAILED', 500);
  }
}
