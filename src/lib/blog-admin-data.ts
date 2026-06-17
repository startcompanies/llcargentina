import { PostStatus } from '@prisma/client';
import {
  escapeHtml,
  estimateReadingTimeFromHtml,
  extractFirstImageFromHtml,
  formatPublishedDate,
  renderPostSectionsHtml
} from '@/lib/blog-html';
import { getBlogPostPath } from '@/lib/blog-routes';
import { getDb } from '@/lib/db';
import type {
  BlogAdminAssetOption,
  BlogAdminCategoryOption,
  BlogAdminCategoryRecord,
  BlogAdminPostEditorData,
  BlogAdminPostSummary
} from '@/lib/blog-admin-types';
import type { BlogArticle } from '@/lib/blog-content';

function formatDatetimeLocal(date: Date | null | undefined) {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function categorySortOrder(left: BlogAdminCategoryOption, right: BlogAdminCategoryOption) {
  return left.name.localeCompare(right.name, 'es');
}

function mediaLabel(url: string, alt: string | null, fileName: string | null) {
  return alt || fileName || url.split('/').pop() || 'Asset';
}

function resolvePostSummaryImage(post: {
  title: string;
  sections: Array<{ type: 'RICH_TEXT' | 'CTA_CONSULTATION' | 'CTA_PRICING' | 'FAQ_MODULE'; html: string | null }>;
  featuredImage: { url: string; alt: string | null } | null;
  openGraphImage: { url: string; alt: string | null } | null;
}) {
  for (const section of post.sections) {
    if (section.type !== 'RICH_TEXT' || !section.html?.trim()) {
      continue;
    }

    const image = extractFirstImageFromHtml(section.html);

    if (image) {
      return {
        url: post.featuredImage?.url || post.openGraphImage?.url || image.src,
        alt: post.featuredImage?.alt || post.openGraphImage?.alt || image.alt || post.title
      };
    }
  }

  return {
    url: post.featuredImage?.url || post.openGraphImage?.url || '/img/blog-1.png',
    alt: post.featuredImage?.alt || post.openGraphImage?.alt || post.title
  };
}

function resolvePostShareImage(post: {
  sections: Array<{ type: 'RICH_TEXT' | 'CTA_CONSULTATION' | 'CTA_PRICING' | 'FAQ_MODULE'; html: string | null }>;
  featuredImage: { url: string; alt: string | null } | null;
  openGraphImage: { url: string; alt: string | null } | null;
}) {
  for (const section of post.sections) {
    if (section.type !== 'RICH_TEXT' || !section.html?.trim()) {
      continue;
    }

    const image = extractFirstImageFromHtml(section.html);

    if (image) {
      return post.openGraphImage?.url || post.featuredImage?.url || image.src || undefined;
    }
  }

  return post.openGraphImage?.url || post.featuredImage?.url || undefined;
}

export async function getBlogAdminAssets(): Promise<BlogAdminAssetOption[]> {
  const db = getDb();
  const assets = await db.mediaAsset.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 80
  });

  return assets.map((asset) => ({
    id: asset.id,
    label: mediaLabel(asset.url, asset.alt, asset.fileName),
    url: asset.url,
    alt: asset.alt || ''
  }));
}

export async function getBlogAdminCategories(): Promise<BlogAdminCategoryOption[]> {
  const db = getDb();
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon
    }))
    .sort(categorySortOrder);
}

export async function getBlogAdminPosts(): Promise<BlogAdminPostSummary[]> {
  const db = getDb();
  const posts = await db.post.findMany({
    include: {
      categories: {
        orderBy: {
          name: 'asc'
        }
      },
      featuredImage: true,
      openGraphImage: true,
      sections: {
        orderBy: {
          position: 'asc'
        }
      }
    },
    orderBy: [
      {
        publishedAt: 'desc'
      },
      {
        updatedAt: 'desc'
      }
    ]
  });

  return posts.map((post) => {
    const summaryImage = resolvePostSummaryImage(post);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString() || null,
      updatedAt: post.updatedAt.toISOString(),
      featuredRank: post.featuredRank,
      excerpt: post.excerpt?.trim() || post.metaDescription?.trim() || post.heroSubtitle?.trim() || '',
      thumbnailUrl: summaryImage.url,
      thumbnailAlt: summaryImage.alt,
      categories: post.categories.map((category) => category.name)
    };
  });
}

export async function getBlogAdminCategoryRecords(): Promise<BlogAdminCategoryRecord[]> {
  const db = getDb();
  const categories = await db.category.findMany({
    include: {
      cardImage: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    icon: category.icon,
    cardImageId: category.cardImageId || '',
    cardImageUrl: category.cardImage?.url
  }));
}

export async function getBlogAdminPostEditorData(postId?: string): Promise<BlogAdminPostEditorData> {
  if (!postId) {
    return {
      title: '',
      slug: '',
      excerpt: '',
      status: PostStatus.DRAFT,
      featuredRank: '',
      heroBadge: '',
      heroTitleHtml: '',
      heroSubtitle: '',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      keywords: '',
      publishedAt: '',
      categoryIds: [],
      featuredImageId: '',
      openGraphImageId: '',
      sections: [{ type: 'RICH_TEXT', html: '' }]
    };
  }

  const db = getDb();
  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      categories: true,
      sections: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  });

  if (!post) {
    throw new Error('No encontramos el post solicitado.');
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    status: post.status,
    featuredRank: post.featuredRank?.toString() || '',
    heroBadge: post.heroBadge || '',
    heroTitleHtml: post.heroTitleHtml || '',
    heroSubtitle: post.heroSubtitle || '',
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
    canonicalUrl: post.canonicalUrl || '',
    keywords: post.keywords.join(', '),
    publishedAt: formatDatetimeLocal(post.publishedAt),
    categoryIds: post.categories.map((category) => category.id),
    featuredImageId: post.featuredImageId || '',
    openGraphImageId: post.openGraphImageId || '',
    sections: post.sections.length
      ? post.sections.map((section) => ({
          type: section.type,
          html: section.html || ''
        }))
      : [{ type: 'RICH_TEXT', html: '' }]
  };
}

export async function getBlogAdminPreviewArticle(postId: string): Promise<BlogArticle | null> {
  const db = getDb();
  const post = await db.post.findUnique({
    where: {
      id: postId
    },
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
    }
  });

  if (!post) {
    return null;
  }

  return {
    postId: post.id,
    slug: post.slug,
    title: post.title,
    description: post.metaDescription?.trim() || post.excerpt?.trim() || post.heroSubtitle?.trim() || post.title,
    keywords: post.keywords,
    badge: post.heroBadge?.trim() || post.categories[0]?.name || 'Blog',
    heroTitleHtml: post.heroTitleHtml?.trim() || escapeHtml(post.title),
    heroSubtitle: post.heroSubtitle?.trim() || post.excerpt?.trim() || '',
    metaItems: [
      post.categories[0]?.name || 'Blog',
      post.status === PostStatus.PUBLISHED && post.publishedAt
        ? formatPublishedDate(post.publishedAt)
        : 'Preview interna',
      `${post.readingTimeMins ?? estimateReadingTimeFromHtml(renderPostSectionsHtml(post.sections))} min`
    ],
    bodyHtml: renderPostSectionsHtml(post.sections),
    canonicalUrl: post.canonicalUrl?.trim() || getBlogPostPath(post.slug),
    publishedTime: post.publishedAt?.toISOString(),
    ogImage: resolvePostShareImage(post),
    metaTitle: post.metaTitle?.trim() || undefined,
    metaDescription: post.metaDescription?.trim() || undefined,
    jsonLd: [],
    navigation: []
  };
}
