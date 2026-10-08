import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { MapPin, TrendingUp, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Real Estate Locations & Localities in Telangana | PropTelangana',
  description: 'Explore growth zones, price trends, and infrastructure developments in Kokapet, Tellapur, Financial District, and Hyderabad.',
};

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { avgPriceSqft: 'desc' },
    include: {
      _count: { select: { properties: true, projects: true } },
    },
  });

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Locations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            Real Estate Hotspots & Micro-Markets in Telangana
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Detailed pricing trends, average capital values, and available inventories across prime zones in Hyderabad, Cyberabad, and ORR Growth Corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={loc.coverImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {loc.type}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-navy-950 group-hover:text-brand-600 transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {loc.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {loc.avgPriceSqft ? (
                    <div>
                      <span className="text-slate-400">Avg. Price</span>
                      <p className="font-extrabold text-slate-900">₹ {loc.avgPriceSqft.toLocaleString()} / sq.ft</p>
                    </div>
                  ) : (
                    <span className="text-slate-400">Price on Request</span>
                  )}
                  <span className="text-brand-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore Hub <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
