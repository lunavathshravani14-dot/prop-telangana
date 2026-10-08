import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag, Share2 } from 'lucide-react';

export const revalidate = 60;

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findFirst({
    where: { OR: [{ slug: params.slug }, { id: params.slug }] },
    select: { title: true, excerpt: true, featuredImage: true },
  });

  if (!post) return { title: 'Article Not Found | PropTelangana' };

  return {
    title: `${post.title} | PropTelangana Insights`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      category: true,
    },
  });

  if (!post) notFound();

  // Increment view counter
  prisma.blogPost
    .update({
      where: { id: post.id },
      data: { viewsCount: { increment: 1 } },
    })
    .catch((err) => console.error(err));

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="mb-8 space-y-3">
          {post.category && (
            <span className="bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category.name}
            </span>
          )}

          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <User className="w-3.5 h-3.5" />
              {post.authorName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span>{post.viewsCount} Reads</span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="rounded-3xl overflow-hidden aspect-[16/9] mb-10 shadow-lg">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm leading-relaxed text-slate-700 text-base space-y-6">
          <p className="font-semibold text-lg text-slate-800 italic border-l-4 border-brand-500 pl-4 py-1">
            {post.excerpt}
          </p>

          <div className="space-y-4 whitespace-pre-line text-slate-700 leading-relaxed">
            {post.content}
          </div>

          {post.tags && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {post.tags.split(',').map((t) => (
                <span key={t} className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">
                  {t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
