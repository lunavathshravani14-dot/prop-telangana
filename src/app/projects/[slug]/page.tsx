import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Building,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Phone,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';

export const revalidate = 60;

interface ProjectDetailPageProps {
  params: { slug: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await prisma.project.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }, { projectId: params.slug }],
    },
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
      developer: true,
      properties: {
        where: { status: 'PUBLISHED' },
        include: {
          images: { where: { isCover: true } },
          developer: { select: { name: true, verified: true } },
        },
      },
    },
  });

  if (!project) notFound();

  const coverImage =
    project.images?.find((img) => img.isCover)?.url ||
    project.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

  const whatsappMessage = encodeURIComponent(
    `Hello PropTelangana! I am interested in project "${project.name}" (${project.projectId}). Please share master layout plan and pricing.`
  );

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-brand-600">Projects</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{project.name}</span>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] min-h-[340px] bg-navy-950 mb-8 shadow-xl">
          <img src={coverImage} alt={project.name} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-brand-600 text-white font-extrabold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                {project.status?.replace(/_/g, ' ')}
              </span>
              {project.reraNumber && (
                <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold text-xs px-3 py-1 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  RERA: {project.reraNumber}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{project.name}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-300 mt-2">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{project.location}, {project.city}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Project Overview Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-extrabold text-navy-950 mb-4">Project Highlights</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                {project.totalArea && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Site Area</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{project.totalArea}</p>
                  </div>
                )}
                {project.totalUnits && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Total Units</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{project.totalUnits}</p>
                  </div>
                )}
                {project.priceRange && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Price Range</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{project.priceRange}</p>
                  </div>
                )}
                {project.possessionDate && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Target Possession</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{project.possessionDate}</p>
                  </div>
                )}
                {project.apartmentSizes && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Unit Configurations</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{project.apartmentSizes}</p>
                  </div>
                )}
                {project.approvalDetails && (
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">Sanctions</p>
                    <p className="font-extrabold text-emerald-700 text-sm mt-0.5 truncate">{project.approvalDetails}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-extrabold text-navy-950 text-base mb-2">Masterplan & Overview</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {project.connectivity && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="font-extrabold text-navy-950 text-base mb-2">Location Connectivity</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {project.connectivity}
                  </p>
                </div>
              )}
            </div>

            {/* Units for sale in this project */}
            {project.properties && project.properties.length > 0 && (
              <div>
                <h2 className="text-xl font-extrabold text-navy-950 mb-4">
                  Available Units in {project.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.properties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Form & Builder */}
          <div className="lg:col-span-4 space-y-6">
            {project.developer && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 p-2 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0">
                  <img src={project.developer.logo || ''} alt={project.developer.name} className="max-h-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">Developer</span>
                  <h4 className="font-extrabold text-navy-950 text-base">{project.developer.name}</h4>
                  <Link href={`/developers/${project.developer.slug}`} className="text-xs text-brand-600 font-semibold hover:underline">
                    View builder portfolio →
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Enquire CTA Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg sticky top-24">
              <h3 className="font-extrabold text-lg text-navy-950 mb-1">Enquire About {project.name}</h3>
              <p className="text-xs text-slate-500 mb-4">
                Get sanctioned floor plans, payment schedules, and schedule a personalized site tour.
              </p>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/917013873126?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp Instantly</span>
                </a>

                <Link
                  href={`/contact?subject=${encodeURIComponent('Enquiry: ' + project.name)}`}
                  className="w-full py-3 bg-navy-900 hover:bg-navy-950 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>Request Instant Callback</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
