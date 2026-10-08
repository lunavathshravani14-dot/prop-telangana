import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Top Real Estate Developers in Telangana & Hyderabad | PropTelangana',
  description: 'Verified builder directory including My Home Group, Aparna Constructions, Rajapushpa, Prestige, and Brigade.',
};

export default async function DevelopersPage() {
  const developers = await prisma.developer.findMany({
    orderBy: { experienceYears: 'desc' },
    include: {
      _count: {
        select: {
          properties: true,
          projects: true,
        },
      },
    },
  });

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Developers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            Telangana’s Top Verified Real Estate Developers
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Institutional builders with verified delivery credentials, TG-RERA compliances, and architectural excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={dev.logo || ''} alt={dev.name} className="max-h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-lg text-navy-950">{dev.name}</h3>
                      {dev.verified && <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">{dev.experienceYears}+ Years Track Record</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-6">
                  {dev.description}
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{dev._count.projects} Ongoing Projects</span>
                  <span>{dev._count.properties} Available Units</span>
                </div>

                <Link
                  href={`/developers/${dev.slug}`}
                  className="w-full py-2.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Developer Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
