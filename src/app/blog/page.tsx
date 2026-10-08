import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Telangana Real Estate Market Insights & RERA Guides | PropTelangana',
  description: 'Articles, legal documentation advice, price trends, and infrastructure updates from the PropTelangana research team.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const where: any = { status: 'PUBLISHED' };
  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Blog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            Real Estate Insights & Legal Guides
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            In-depth market intelligence, TG-RERA consumer protections, infrastructure masterplans, and smart home-buying advice.
          </p>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm border ${
                !searchParams.category ? 'bg-navy-950 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Articles
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/blog?category=${c.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm border ${
                  searchParams.category === c.slug
                    ? 'bg-navy-950 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {c.name} ({c._count.posts})
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                  <img
                    src={post.featuredImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                      {post.category.name}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-extrabold text-lg text-navy-950 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </span>
                <span className="text-brand-600 font-bold group-hover:translate-x-1 transition-transform">
                  Read Article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
