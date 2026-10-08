import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const skip = (page - 1) * limit;

    const category = searchParams.get('category');
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status') || 'PUBLISHED';

    const where: any = {};
    if (status !== 'ALL') {
      where.status = status;
    }
    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [total, posts, categories] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: true,
        },
      }),
      prisma.blogCategory.findMany({
        include: { _count: { select: { posts: true } } },
      }),
    ]);

    return apiSuccess(
      {
        posts,
        categories,
      },
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    );
  } catch (error: any) {
    console.error('Blog fetch error:', error);
    return apiError('Failed to fetch blog posts', 'FETCH_FAILED', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'ADMIN', 'EDITOR'])) {
      return apiError('Unauthorized to create blog articles', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const { title, featuredImage, content, excerpt, categoryId, tags, seoTitle, metaDescription, status = 'PUBLISHED' } = body;

    if (!title || !content) {
      return apiError('Title and content are required', 'VALIDATION_ERROR', 400);
    }

    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const slug = `${baseSlug}-${randomSuffix}`;

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        featuredImage,
        content,
        excerpt: excerpt || content.substring(0, 160),
        categoryId: categoryId || null,
        authorId: user.id,
        authorName: user.name,
        tags,
        seoTitle: seoTitle || title,
        metaDescription: metaDescription || excerpt,
        status,
      },
    });

    return apiSuccess(newPost, undefined, 201);
  } catch (error: any) {
    console.error('Blog create error:', error);
    return apiError('Failed to create blog post', 'CREATE_FAILED', 500);
  }
}
