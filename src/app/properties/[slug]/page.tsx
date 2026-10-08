import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PropertyDetailClient from './PropertyDetailClient';

export const revalidate = 60;

interface PropertyDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const property = await prisma.property.findFirst({
    where: { OR: [{ slug: params.slug }, { id: params.slug }, { propertyId: params.slug }] },
    select: { title: true, description: true, priceDisplay: true, locality: true, city: true, images: { take: 1 } },
  });

  if (!property) return { title: 'Property Not Found | PropTelangana' };

  return {
    title: `${property.title} | PropTelangana`,
    description: property.description.substring(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.substring(0, 160),
      images: property.images[0]?.url ? [property.images[0].url] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await prisma.property.findFirst({
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

  if (!property) {
    notFound();
  }

  // Fetch similar properties
  const similarProperties = await prisma.property.findMany({
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

  return <PropertyDetailClient property={property} similarProperties={similarProperties} />;
}
