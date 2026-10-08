import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Building2, CheckCircle2, Phone, Mail, Globe, MapPin, ArrowRight } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import PropertyCard from '@/components/PropertyCard';

export const revalidate = 60;

interface DeveloperProfilePageProps {
  params: { slug: string };
}

export default async function DeveloperProfilePage({ params }: DeveloperProfilePageProps) {
  const developer = await prisma.developer.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      projects: {
        include: {
          images: { orderBy: { orderIndex: 'asc' } },
        },
      },
      properties: {
        where: { status: 'PUBLISHED' },
        include: {
          images: { where: { isCover: true } },
          developer: { select: { name: true, verified: true } },
        },
      },
    },
  });

  if (!developer) notFound();

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/developers" className="hover:text-brand-600">Developers</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{developer.name}</span>
        </div>

        {/* Developer Header Profile Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 rounded-3xl bg-slate-50 p-3 border border-slate-200 shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
            <img src={developer.logo || ''} alt={developer.name} className="max-h-full object-contain" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">{developer.name}</h1>
              {developer.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200 w-fit mx-auto md:mx-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Builder
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {developer.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 font-medium">
              {developer.experienceYears && (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-navy-950">{developer.experienceYears}+</span> Years in Industry
                </div>
              )}
              {developer.officeAddress && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>{developer.officeAddress}</span>
                </div>
              )}
              {developer.website && (
                <a href={developer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-brand-600 hover:underline">
                  <Globe className="w-4 h-4" />
                  <span>Official Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {developer.projects.length > 0 && (
          <div className="mb-14">
            <h2 className="text-2xl font-extrabold text-navy-950 mb-6">
              Mega Projects by {developer.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {developer.projects.map((prj) => (
                <ProjectCard key={prj.id} project={{ ...prj, developer }} />
              ))}
            </div>
          </div>
        )}

        {/* Available Properties Section */}
        {developer.properties.length > 0 && (
          <div>
            <h2 className="text-2xl font-extrabold text-navy-950 mb-6">
              Available Units by {developer.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {developer.properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
