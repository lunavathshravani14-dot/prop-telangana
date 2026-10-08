import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, TrendingUp, Building2, CheckCircle2 } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import ProjectCard from '@/components/ProjectCard';

export const revalidate = 60;

interface LocationDetailPageProps {
  params: { slug: string };
}

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const location = await prisma.location.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      children: true,
      properties: {
        where: { status: 'PUBLISHED' },
        include: {
          images: { where: { isCover: true } },
          developer: { select: { name: true, verified: true } },
        },
      },
      projects: {
        include: {
          images: { where: { isCover: true } },
          developer: { select: { name: true } },
        },
      },
    },
  });

  if (!location) notFound();

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/locations" className="hover:text-brand-600">Locations</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{location.name}</span>
        </div>

        {/* Hero Banner Card */}
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] min-h-[300px] bg-navy-950 mb-10 shadow-xl">
          <img
            src={location.coverImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80'}
            alt={location.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">
              {location.type} OVERVIEW
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Real Estate in {location.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {location.description}
            </p>

            {location.avgPriceSqft && (
              <div className="mt-4 flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
                  <span className="text-slate-300">Average Rate: </span>
                  <span className="font-extrabold text-brand-300 text-sm">
                    ₹ {location.avgPriceSqft.toLocaleString()} / sq.ft
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties in Location */}
        {location.properties.length > 0 ? (
          <div className="mb-14">
            <h2 className="text-2xl font-extrabold text-navy-950 mb-6">
              Properties Available in {location.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {location.properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 mb-12">
            <p className="text-sm text-slate-500">Currently collecting new verified units in {location.name}.</p>
          </div>
        )}

        {/* Projects in Location */}
        {location.projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-extrabold text-navy-950 mb-6">
              Projects in {location.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {location.projects.map((prj) => (
                <ProjectCard key={prj.id} project={prj} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
