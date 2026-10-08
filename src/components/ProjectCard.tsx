'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Building, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
  project: any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const coverImage =
    project.images?.find((img: any) => img.isCover)?.url ||
    project.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  const statusColors: Record<string, string> = {
    UPCOMING: 'bg-blue-600 text-white',
    ONGOING: 'bg-emerald-600 text-white',
    READY_TO_MOVE: 'bg-purple-600 text-white',
    COMPLETED: 'bg-slate-700 text-white',
  };

  const statusLabels: Record<string, string> = {
    UPCOMING: 'New Launch',
    ONGOING: 'Under Construction',
    READY_TO_MOVE: 'Ready to Move',
    COMPLETED: 'Completed',
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Link href={`/projects/${project.slug}`}>
          <img
            src={coverImage}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider ${
              statusColors[project.status] || 'bg-slate-800 text-white'
            }`}
          >
            {statusLabels[project.status] || project.status}
          </span>
        </div>

        {/* Developer Badge */}
        {project.developer && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-slate-800 text-xs font-bold shadow flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-brand-600" />
            <span className="truncate max-w-[120px]">{project.developer.name}</span>
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent p-3 pt-8 text-white">
          <p className="text-[11px] text-slate-300 font-medium">Starting from</p>
          <p className="text-xl font-extrabold tracking-tight text-white">
            {project.priceRange || 'Price on Request'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span className="truncate">{project.location}, {project.city}</span>
          </div>

          <Link href={`/projects/${project.slug}`}>
            <h3 className="font-bold text-navy-950 text-lg hover:text-brand-600 transition-colors line-clamp-1 mb-2">
              {project.name}
            </h3>
          </Link>

          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>

          <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl text-slate-700">
            {project.totalArea && (
              <div className="flex justify-between">
                <span className="text-slate-500">Project Land:</span>
                <span className="font-semibold text-slate-800">{project.totalArea}</span>
              </div>
            )}
            {project.apartmentSizes && (
              <div className="flex justify-between">
                <span className="text-slate-500">Configurations:</span>
                <span className="font-semibold text-slate-800">{project.apartmentSizes}</span>
              </div>
            )}
            {project.possessionDate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Possession:</span>
                <span className="font-semibold text-slate-800">{project.possessionDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* View Project CTA */}
        <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
          {project.reraNumber ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3.5 h-3.5" /> TG-RERA Approved
            </span>
          ) : (
            <span />
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-0.5 transition-all"
          >
            Explore Project <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
