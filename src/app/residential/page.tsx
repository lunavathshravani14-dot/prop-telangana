import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import PropertyCard from '@/components/PropertyCard';

export const revalidate = 60;

export const metadata = {
  title: 'Residential Apartments & Villas in Hyderabad | PropTelangana',
  description: 'Explore verified luxury 2, 3, 4 BHK apartments and gated community villas in Kokapet, Tellapur, Gachibowli, and Financial District.',
};

export default async function ResidentialPage() {
  const properties = await prisma.property.findMany({
    where: {
      status: 'PUBLISHED',
      propertyType: { in: ['APARTMENT', 'VILLA', 'INDEPENDENT_HOUSE'] },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
      developer: { select: { name: true, verified: true } },
    },
  });

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Residential</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            Residential Apartments & Gated Villas in Hyderabad
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Discover verified 2, 3 & 4 BHK sky residences and triplex villas with world-class clubhouses and 100% TG-RERA clearances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>
    </div>
  );
}
