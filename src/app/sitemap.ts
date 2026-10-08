import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://proptelangana.com';

  let properties: { slug: string; updatedAt: Date }[] = [];
  let projects: { slug: string; updatedAt: Date }[] = [];
  let developers: { slug: string; updatedAt: Date }[] = [];
  let locations: { slug: string; updatedAt: Date }[] = [];
  let blogs: { slug: string; updatedAt: Date }[] = [];

  try {
    [properties, projects, developers, locations, blogs] = await Promise.all([
      prisma.property.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.project.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.developer.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.location.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch (err) {
    console.error('Sitemap build/fetch error:', err);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/properties',
    '/projects',
    '/residential',
    '/commercial',
    '/plots',
    '/land',
    '/developers',
    '/locations',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const developerRoutes: MetadataRoute.Sitemap = developers.map((d) => ({
    url: `${baseUrl}/developers/${d.slug}`,
    lastModified: d.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${baseUrl}/locations/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...propertyRoutes,
    ...projectRoutes,
    ...developerRoutes,
    ...locationRoutes,
    ...blogRoutes,
  ];
}
