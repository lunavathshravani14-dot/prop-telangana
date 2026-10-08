import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'EDITOR'])) {
      return apiError('Unauthorized', 'FORBIDDEN', 403);
    }

    const [
      totalProperties,
      publishedProperties,
      featuredProperties,
      pendingProperties,
      totalProjects,
      totalDevelopers,
      totalUsers,
      totalLeads,
      newLeads,
      siteVisitLeads,
      convertedLeads,
      recentLeads,
      topProperties,
      popularLocations,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: 'PUBLISHED' } }),
      prisma.property.count({ where: { featured: true } }),
      prisma.property.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.project.count(),
      prisma.developer.count(),
      prisma.user.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'SITE_VISIT' } }),
      prisma.lead.count({ where: { status: 'CONVERTED' } }),
      prisma.lead.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { title: true, propertyId: true } },
          assignedAgent: { select: { name: true } },
        },
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { viewsCount: 'desc' },
        select: {
          id: true,
          title: true,
          propertyId: true,
          locality: true,
          priceDisplay: true,
          viewsCount: true,
          status: true,
        },
      }),
      prisma.location.findMany({
        where: { popular: true },
        take: 6,
        select: {
          id: true,
          name: true,
          type: true,
          avgPriceSqft: true,
          _count: { select: { properties: true } },
        },
      }),
    ]);

    // Simulated 7-day timeline metrics for charts
    const leadTimeline = [
      { day: 'Mon', leads: 4, visits: 2 },
      { day: 'Tue', leads: 7, visits: 3 },
      { day: 'Wed', leads: 5, visits: 4 },
      { day: 'Thu', leads: 9, visits: 5 },
      { day: 'Fri', leads: 8, visits: 6 },
      { day: 'Sat', leads: 14, visits: 9 },
      { day: 'Sun', leads: 12, visits: 8 },
    ];

    const leadStatusBreakdown = [
      { status: 'NEW', count: newLeads },
      { status: 'SITE_VISIT', count: siteVisitLeads },
      { status: 'CONVERTED', count: convertedLeads },
      { status: 'OTHERS', count: Math.max(0, totalLeads - newLeads - siteVisitLeads - convertedLeads) },
    ];

    return apiSuccess({
      metrics: {
        totalProperties,
        publishedProperties,
        pendingProperties,
        featuredProperties,
        totalProjects,
        totalDevelopers,
        totalUsers,
        totalLeads,
        newLeads,
        siteVisitLeads,
        convertedLeads,
      },
      recentLeads,
      topProperties,
      popularLocations,
      leadTimeline,
      leadStatusBreakdown,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return apiError('Failed to fetch admin stats', 'FETCH_FAILED', 500);
  }
}
