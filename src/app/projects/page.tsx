import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProjectCard from '@/components/ProjectCard';

export const revalidate = 60;

export const metadata = {
  title: 'Mega Projects & Gated Townships in Hyderabad | PropTelangana',
  description: 'Explore upcoming and ongoing luxury residential gated communities and commercial complexes across Telangana.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { projectType?: string; status?: string };
}) {
  const where: any = {};
  if (searchParams.projectType) {
    where.projectType = searchParams.projectType.toUpperCase();
  }
  if (searchParams.status) {
    where.status = searchParams.status.toUpperCase();
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
      developer: { select: { id: true, name: true, slug: true, logo: true } },
    },
  });

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Projects</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            Gated Communities & Mega Projects in Hyderabad
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Verified master developments from Telangana’s top developers. Explore unit configurations, master plans, and direct builder pricing.
          </p>

          {/* Quick Filter Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {[
              { label: 'All Projects', href: '/projects' },
              { label: 'Under Construction', href: '/projects?status=ONGOING' },
              { label: 'Ready to Move', href: '/projects?status=READY_TO_MOVE' },
              { label: 'New Launches', href: '/projects?status=UPCOMING' },
            ].map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap shadow-sm"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((prj) => (
            <ProjectCard key={prj.id} project={prj} />
          ))}
        </div>
      </div>
    </div>
  );
}
