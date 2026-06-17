import { type PostSectionType } from '@prisma/client';
import { getDb } from '@/lib/db';
import { renderPostSectionsHtml } from '@/lib/blog-html';

type ExportedSection = {
  type: PostSectionType;
  html: string;
};

export type ExportedBlogPostRecord = {
  sourceType?: string;
  sourceId?: string;
  sourceUrl?: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  publishedAt?: string;
  featuredRank?: number | null;
  heroBadge?: string;
  heroTitleHtml?: string;
  heroSubtitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords: string[];
  categories: Array<{
    name: string;
    slug: string;
  }>;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  openGraphImageUrl?: string;
  openGraphImageAlt?: string;
  html: string;
  sections: ExportedSection[];
};

export async function getBlogPostsExportRecords(): Promise<ExportedBlogPostRecord[]> {
  const db = getDb();
  const posts = await db.post.findMany({
    include: {
      categories: {
        orderBy: {
          name: 'asc'
        }
      },
      sections: {
        orderBy: {
          position: 'asc'
        }
      },
      featuredImage: true,
      openGraphImage: true
    },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }]
  });

  return posts.map((post) => ({
    sourceType: post.sourceType || undefined,
    sourceId: post.sourceId || undefined,
    sourceUrl: post.sourceUrl || undefined,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    status: post.status,
    publishedAt: post.publishedAt?.toISOString(),
    featuredRank: post.featuredRank,
    heroBadge: post.heroBadge || undefined,
    heroTitleHtml: post.heroTitleHtml || undefined,
    heroSubtitle: post.heroSubtitle || undefined,
    metaTitle: post.metaTitle || undefined,
    metaDescription: post.metaDescription || undefined,
    canonicalUrl: post.canonicalUrl || undefined,
    keywords: post.keywords,
    categories: post.categories.map((category) => ({
      name: category.name,
      slug: category.slug
    })),
    featuredImageUrl: post.featuredImage?.url || undefined,
    featuredImageAlt: post.featuredImage?.alt || undefined,
    openGraphImageUrl: post.openGraphImage?.url || undefined,
    openGraphImageAlt: post.openGraphImage?.alt || undefined,
    html: renderPostSectionsHtml(post.sections),
    sections: post.sections.map((section) => ({
      type: section.type,
      html: section.html || ''
    }))
  }));
}
