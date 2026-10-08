import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import PropertyCard from '@/components/PropertyCard';

export const revalidate = 60;

export const metadata = {
  title: 'Commercial Real Estate & Tech Office Spaces in Hyderabad | PropTelangana',
  description: 'Grade-A IT parks, commercial tech office spaces, and retail hubs with pre-leased rental yields in Gachibowli and HITEC City.',
};

export default async function CommercialPage() {
  const properties = await prisma.property.findMany({
    where: {
      status: 'PUBLISHED',
      propertyType: 'COMMERCIAL',
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
            <span className="font-semibold text-slate-800">Commercial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            Commercial Properties & IT Tech Spaces in Telangana
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Pre-leased institutional office floors, bare-shell corporate campuses, and retail spaces offering up to 9% assured rental yields.
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
