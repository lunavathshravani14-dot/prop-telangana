import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];

    if (ids.length === 0) {
      return apiSuccess([]);
    }

    // Limit to max 4 properties for comparison
    const targetIds = ids.slice(0, 4);

    const properties = await prisma.property.findMany({
      where: {
        id: { in: targetIds },
      },
      include: {
        images: { where: { isCover: true } },
        developer: true,
        amenities: {
          include: { amenity: true },
        },
      },
    });

    return apiSuccess(properties);
  } catch (error: any) {
    console.error('Comparison fetch error:', error);
    return apiError('Failed to fetch properties for comparison', 'FETCH_FAILED', 500);
  }
}
