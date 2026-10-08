import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import HeroSearch from '@/components/HeroSearch';
import PropertyCard from '@/components/PropertyCard';
import ProjectCard from '@/components/ProjectCard';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ArrowRight,
  Award,
  Users,
  Compass,
  FileCheck,
  HelpCircle,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const revalidate = 60; // ISR cache every 60 seconds

async function getHomeData() {
  try {
    const [
      featuredProperties,
      featuredProjects,
      popularLocations,
      featuredDevelopers,
      latestProperties,
      latestBlogs,
    ] = await Promise.all([
      prisma.property.findMany({
        where: { featured: true, status: 'PUBLISHED' },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { orderIndex: 'asc' } },
          developer: { select: { id: true, name: true, slug: true, logo: true, verified: true } },
          agent: { select: { id: true, name: true, phone: true } },
        },
      }),
      prisma.project.findMany({
        where: { featured: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { orderIndex: 'asc' } },
          developer: { select: { id: true, name: true, slug: true, logo: true } },
        },
      }),
      prisma.location.findMany({
        where: { popular: true },
        take: 6,
        include: {
          _count: { select: { properties: true, projects: true } },
        },
      }),
      prisma.developer.findMany({
        take: 4,
        include: {
          _count: { select: { properties: true, projects: true } },
        },
      }),
      prisma.property.findMany({
        where: { status: 'PUBLISHED' },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { orderIndex: 'asc' } },
          developer: { select: { id: true, name: true, slug: true, logo: true, verified: true } },
        },
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
      }),
    ]);

    return {
      featuredProperties,
      featuredProjects,
      popularLocations,
      featuredDevelopers,
      latestProperties,
      latestBlogs,
    };
  } catch (err) {
    console.error('Home data error:', err);
    return {
      featuredProperties: [],
      featuredProjects: [],
      popularLocations: [],
      featuredDevelopers: [],
      latestProperties: [],
      latestBlogs: [],
    };
  }
}

export default async function HomePage() {
  const {
    featuredProperties,
    featuredProjects,
    popularLocations,
    featuredDevelopers,
    latestProperties,
    latestBlogs,
  } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-navy-950">
        {/* Background Image with Dark Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 scale-105 transform animate-pulse duration-[10000ms]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-400 text-xs sm:text-sm font-bold mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% TG-RERA & HMDA Certified Properties</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto">
            Discover Exceptional Real Estate Across{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-amber-300">
              Telangana
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-normal">
            Direct builder pricing, verified legal titles, and personalized advisory for luxury high-rises in Kokapet, gated villas in Tellapur, and HMDA layout plots in Mokila.
          </p>

          {/* Search Box Engine */}
          <HeroSearch />

          {/* Key Stat Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left text-white/90">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xl sm:text-2xl font-extrabold text-brand-400">₹ 0</p>
              <p className="text-xs text-slate-300">Zero Buyer Brokerage</p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xl sm:text-2xl font-extrabold text-brand-400">1,200+</p>
              <p className="text-xs text-slate-300">Verified Units</p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xl sm:text-2xl font-extrabold text-brand-400">100%</p>
              <p className="text-xs text-slate-300">RERA Sanctioned</p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xl sm:text-2xl font-extrabold text-brand-400">24 Hrs</p>
              <p className="text-xs text-slate-300">Site Visit Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Explore Portfolios
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
                Property Categories in Telangana
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md mt-2 md:mt-0">
              Hand-picked segments catering to first-time homebuyers, luxury upgraders, and high-yield investors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                title: 'High-Rise Apartments',
                href: '/residential',
                img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80',
                count: '450+ Units',
              },
              {
                title: 'Gated Luxury Villas',
                href: '/properties?propertyType=VILLA',
                img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=500&q=80',
                count: '180+ Villas',
              },
              {
                title: 'HMDA & DTCP Plots',
                href: '/plots',
                img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80',
                count: '320+ Plots',
              },
              {
                title: 'Commercial & IT',
                href: '/commercial',
                img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80',
                count: '95+ Tech Parks',
              },
              {
                title: 'Growth Land & Farm',
                href: '/land',
                img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80',
                count: '60+ Parcels',
              },
            ].map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] text-brand-300 font-bold uppercase tracking-wider">
                    {cat.count}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold group-hover:text-brand-400 transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Hand-Selected Collection</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 mt-1">
                Featured Properties in Telangana
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-600 hover:text-brand-700 mt-3 sm:mt-0"
            >
              <span>View All Properties ({featuredProperties.length}+)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Mega Developments
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 mt-1">
                Featured Gated Townships & Towers
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-600 hover:text-brand-700 mt-3 sm:mt-0"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((prj) => (
              <ProjectCard key={prj.id} project={prj} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. POPULAR LOCATIONS */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Strategic Investment Corridors
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-white">
              Explore Popular Locations in Hyderabad
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Comprehensive neighborhood insights, connectivity maps, and average price trends across prime Telangana micro-markets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-800 border border-slate-700/60 hover:border-brand-500 shadow-lg"
              >
                <img
                  src={loc.coverImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent p-5 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-white group-hover:text-brand-400 transition-colors">
                        {loc.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{loc.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10 text-xs">
                    <span className="font-semibold text-brand-300">
                      Avg. ₹ {loc.avgPriceSqft?.toLocaleString() || '8,500'} / sq.ft
                    </span>
                    <span className="text-slate-400">
                      {loc._count.properties} Properties
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>View All 20+ Telangana Localities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED DEVELOPERS */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Institutional Builders
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 mt-1">
              Telangana’s Top Verified Developers
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Grade-A builders with verified track records of timely delivery and impeccable engineering standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDevelopers.map((dev) => (
              <Link
                key={dev.id}
                href={`/developers/${dev.slug}`}
                className="group p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white p-2 border border-slate-200 shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                  <img
                    src={dev.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80'}
                    alt={dev.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-extrabold text-navy-950 text-base group-hover:text-brand-600 transition-colors">
                    {dev.name}
                  </h3>
                  {dev.verified && <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />}
                </div>

                <p className="text-xs text-slate-500 mb-3">{dev.experienceYears}+ Years of Experience</p>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {dev.description}
                </p>

                <div className="w-full pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>{dev._count.projects} Projects</span>
                  <span className="text-brand-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    View Portfolio →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY PROPTELANGANA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              The PropTelangana Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-1">
              Why Discerning Buyers Choose PropTelangana
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              We bridge home seekers directly with verified builders, eliminating middleman inflation and legal ambiguity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-2">100% Legal & RERA Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every property and project listed undergoes thorough title clearance checks, TG-RERA number validation, and HMDA/GHMC sanctioned plan verification.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-2">Direct Developer Pricing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zero brokerage charges for buyers. Get direct access to exclusive launch offers, pre-construction pricing, and tailored payment schedules.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-2">Dedicated Advisory & Free Site Visits</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Assigned local property consultants guide your comparative evaluations and arrange complimentary chauffeur-driven site inspections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LATEST BLOGS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Market Intelligence
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 mt-1">
                Latest Real Estate News & Guides
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-600 hover:text-brand-700 mt-3 sm:mt-0"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group flex flex-col bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img
                    src={blog.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {blog.category && (
                    <span className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                      {blog.category.name}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-navy-950 text-base leading-snug group-hover:text-brand-600 transition-colors line-clamp-2 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                    <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                    <span className="text-brand-600 font-bold group-hover:translate-x-1 transition-transform">
                      Read Article →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. VISITOR CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Ready to find your dream property?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-1 text-white">
              Speak with a Senior Telangana Property Specialist Today
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Receive tailored project brochures, latest price sheets, and book complimentary VIP site visits without any brokerage fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Request Free Callback</span>
            </Link>
            <a
              href="https://wa.me/917013873126"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-xl border border-white/20 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
