import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import PropertyCard from '@/components/PropertyCard';

export const revalidate = 60;

export const metadata = {
  title: 'HMDA & DTCP Approved Open Plots in Hyderabad | PropTelangana',
  description: 'Verified gated layout open plots and villa plots in Mokila, Shankarpally, Yadadri, and Shadnagar with clear bank loan sanctions.',
};

export default async function PlotsPage() {
  let properties: any[] = [];
  try {
    properties = await prisma.property.findMany({
      where: {
        status: 'PUBLISHED',
        propertyType: 'PLOT',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        developer: { select: { name: true, verified: true } },
      },
    });
  } catch (err) {
    console.error('PlotsPage build/fetch error:', err);
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Plots</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            HMDA & DTCP Approved Open Plots in Telangana
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            100% Vastu compliant residential villa plots with underground electricity, avenue plantation, and SBI/HDFC bank loan approvals.
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
