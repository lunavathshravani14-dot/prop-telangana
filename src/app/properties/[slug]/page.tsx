import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PropertyDetailClient from './PropertyDetailClient';

import { JB_PROPERTIES } from '@/lib/jb-projects-data';

export const revalidate = 60;

interface PropertyDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  let property: any = null;
  try {
    property = await prisma.property.findFirst({
      where: { OR: [{ slug: params.slug }, { id: params.slug }, { propertyId: params.slug }] },
      select: { title: true, description: true, priceDisplay: true, locality: true, city: true, images: { take: 1 } },
    });
  } catch {
    // ignore
  }

  if (!property) {
    property = JB_PROPERTIES.find(
      (p) =>
        p.slug === params.slug ||
        p.slug.startsWith(params.slug) ||
        p.id === params.slug ||
        p.propertyId === params.slug
    );
  }

  if (!property) return { title: 'Property Not Found | PropTelangana' };

  return {
    title: `${property.title} | PropTelangana`,
    description: (property.description || '').substring(0, 160),
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  let property: any = null;
  let similarProperties: any[] = [];

  try {
    property = await prisma.property.findFirst({
      where: {
        OR: [{ slug: params.slug }, { id: params.slug }, { propertyId: params.slug }],
      },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        videos: true,
        documents: true,
        developer: true,
        agent: true,
        project: true,
        amenities: {
          include: { amenity: true },
        },
      },
    });

    if (property) {
      similarProperties = await prisma.property.findMany({
        where: {
          id: { not: property.id },
          status: 'PUBLISHED',
          OR: [{ locality: property.locality }, { propertyType: property.propertyType }],
        },
        take: 3,
        include: {
          images: { where: { isCover: true } },
          developer: { select: { name: true, verified: true } },
        },
      });
    }
  } catch (err) {
    console.warn('Database offline on property detail, serving from memory:', err);
  }

  if (!property) {
    property = JB_PROPERTIES.find(
      (p) =>
        p.slug === params.slug ||
        p.slug.startsWith(params.slug) ||
        p.id === params.slug ||
        p.propertyId === params.slug
    );
    if (property) {
      similarProperties = JB_PROPERTIES.filter((p) => p.id !== property.id).slice(0, 3);
    }
  }

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} similarProperties={similarProperties} />;
}
