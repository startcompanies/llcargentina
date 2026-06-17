import { CategoryIcon, PostSectionType, PostStatus } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import {
  escapeHtml,
  estimateReadingTimeFromHtml,
  extractFirstImageFromHtml,
  formatPublishedDate,
  renderPostSectionsHtml,
  sanitizePostHtml
} from '@/lib/blog-html';
import { getPublishValidationErrors } from '@/lib/blog-publish-validation';
import { getDb } from '@/lib/db';
import { storeUploadedFile, type StoredMediaResult } from '@/lib/media-storage';
import { slugify } from '@/lib/slug';
import type {
  BlogAdminAssetOption,
  BlogAdminCategoryOption,
  BlogAdminCategoryRecord,
  BlogAdminPostEditorData,
  BlogAdminPostSectionInput,
  BlogAdminPostSummary
} from '@/lib/blog-admin-types';
import type { BlogArticle } from '@/lib/blog-content';

const postStatusSchema = z.nativeEnum(PostStatus);
const categoryIconSchema = z.nativeEnum(CategoryIcon);
const sectionTypeSchema = z.nativeEnum(PostSectionType);

const postSectionsSchema = z.array(
  z.object({
    type: sectionTypeSchema,
    html: z.string().default('')
  })
);

type SavePostInput = {
  postId?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  status: PostStatus;
  featuredRank?: string;
  heroBadge?: string;
  heroTitleHtml?: string;
  heroSubtitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string;
  publishedAt?: string;
  categoryIds: string[];
  featuredImageId?: string;
  openGraphImageId?: string;
  featuredImageAlt?: string;
  openGraphImageAlt?: string;
  sections: BlogAdminPostSectionInput[];
  featuredImageFile?: File;
  openGraphImageFile?: File;
};

type SaveCategoryInput = {
  categoryId?: string;
  name: string;
  slug?: string;
  description?: string;
  icon: CategoryIcon;
  cardImageId?: string;
  cardImageAlt?: string;
  cardImageFile?: File;
};

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

function parseOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

function parseCategoryIds(formData: FormData) {
  return formData
    .getAll('categoryIds')
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);
}

function parseSectionsJson(formData: FormData) {
  const raw = parseOptionalString(formData.get('sectionsJson'));

  if (!raw) {
    return [{ type: PostSectionType.RICH_TEXT, html: '' }] satisfies BlogAdminPostSectionInput[];
  }

  try {
    return postSectionsSchema.parse(JSON.parse(raw)).map((section) => ({
      type: section.type,
      html: section.type === PostSectionType.RICH_TEXT ? sanitizePostHtml(section.html || '') : ''
    }));
  } catch {
    throw new Error('No se pudieron procesar las secciones del artículo.');
  }
}

function sanitizeHeroTitleHtml(value: string | undefined, fallbackTitle: string) {
  const normalized = value?.trim();

  if (!normalized) {
    return escapeHtml(fallbackTitle);
  }

  return sanitizeHtml(normalized, {
    allowedTags: ['br', 'strong', 'em', 'span'],
    allowedAttributes: {
      span: ['class']
    }
  }).trim() || escapeHtml(fallbackTitle);
}

function resolvePostSummaryImage(post: {
  title: string;
  sections: Array<{ type: PostSectionType; html: string | null }>;
  featuredImage: { url: string; alt: string | null } | null;
  openGraphImage: { url: string; alt: string | null } | null;
}) {
  for (const section of post.sections) {
    if (section.type !== PostSectionType.RICH_TEXT || !section.html?.trim()) {
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
  sections: Array<{ type: PostSectionType; html: string | null }>;
  featuredImage: { url: string; alt: string | null } | null;
  openGraphImage: { url: string; alt: string | null } | null;
}) {
  for (const section of post.sections) {
    if (section.type !== PostSectionType.RICH_TEXT || !section.html?.trim()) {
      continue;
    }

    const image = extractFirstImageFromHtml(section.html);

    if (image) {
      return post.openGraphImage?.url || post.featuredImage?.url || image.src || undefined;
    }
  }

  return post.openGraphImage?.url || post.featuredImage?.url || undefined;
}

function parseKeywords(value: string | undefined) {
  return (value || '')
    .split(/[,\n]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function parseFeaturedRank(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function ensurePostTitle(title: string | undefined) {
  const normalized = title?.trim();

  if (!normalized) {
    throw new Error('El título del post es obligatorio.');
  }

  return normalized;
}

function ensureCategoryName(name: string | undefined) {
  const normalized = name?.trim();

  if (!normalized) {
    throw new Error('El nombre de la categoría es obligatorio.');
  }

  return normalized;
}

async function createMediaAssetRecord(stored: StoredMediaResult) {
  const db = getDb();

  return db.mediaAsset.create({
    data: {
      storageKey: stored.storageKey,
      url: stored.url,
      alt: stored.alt,
      mimeType: stored.mimeType,
      fileName: stored.fileName,
      sizeBytes: stored.sizeBytes
    }
  });
}

async function persistUploadedAsset(file: File | undefined, alt: string | undefined) {
  if (!file || file.size <= 0) {
    return null;
  }

  const stored = await storeUploadedFile(file, alt);
  return createMediaAssetRecord(stored);
}

async function resolveImageId(existingId: string | undefined, file: File | undefined, alt: string | undefined) {
  const uploadedAsset = await persistUploadedAsset(file, alt);
  return uploadedAsset?.id || existingId || null;
}

function categorySortOrder(left: BlogAdminCategoryOption, right: BlogAdminCategoryOption) {
  return left.name.localeCompare(right.name, 'es');
}

function mediaLabel(url: string, alt: string | null, fileName: string | null) {
  return alt || fileName || url.split('/').pop() || 'Asset';
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
      sections: [{ type: PostSectionType.RICH_TEXT, html: '' }]
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
      : [{ type: PostSectionType.RICH_TEXT, html: '' }]
  };
}

export async function savePost(input: SavePostInput) {
  const db = getDb();
  const title = ensurePostTitle(input.title);
  const slug = slugify(input.slug || title);

  if (!slug) {
    throw new Error('No pudimos generar un slug válido para el post.');
  }

  const conflictingPost = await db.post.findFirst({
    where: {
      slug,
      NOT: input.postId
        ? {
            id: input.postId
          }
        : undefined
    },
    select: {
      id: true
    }
  });

  if (conflictingPost) {
    throw new Error('Ya existe otro post con ese slug.');
  }

  const featuredImageId = await resolveImageId(input.featuredImageId, input.featuredImageFile, input.featuredImageAlt);
  const openGraphImageId = await resolveImageId(input.openGraphImageId, input.openGraphImageFile, input.openGraphImageAlt);
  const parsedPublishedAt = input.publishedAt ? new Date(input.publishedAt) : null;

  if (parsedPublishedAt && Number.isNaN(parsedPublishedAt.getTime())) {
    throw new Error('La fecha de publicación no es válida.');
  }

  const sections = input.sections.length ? input.sections : [{ type: PostSectionType.RICH_TEXT, html: '' }];
  const publishValidationErrors = getPublishValidationErrors({
    status: input.status,
    title,
    slug,
    excerpt: input.excerpt,
    heroSubtitle: input.heroSubtitle,
    categoryIds: input.categoryIds,
    featuredImageId,
    hasFeaturedImageUpload: Boolean(input.featuredImageFile && input.featuredImageFile.size > 0),
    sections
  });

  if (publishValidationErrors.length > 0) {
    throw new Error(`Para publicar este post completá: ${publishValidationErrors.join(', ')}.`);
  }

  const readingTimeMins = estimateReadingTimeFromHtml(renderPostSectionsHtml(sections));
  const persistedPost = await db.$transaction(async (transaction) => {
    const existingPost = input.postId
      ? await transaction.post.findUnique({
          where: {
            id: input.postId
          },
          select: {
            publishedAt: true
          }
        })
      : null;

    const publishedAt =
      input.status === PostStatus.PUBLISHED
        ? parsedPublishedAt || existingPost?.publishedAt || new Date()
        : parsedPublishedAt;

    const post = input.postId
      ? await transaction.post.update({
          where: {
            id: input.postId
          },
          data: {
            slug,
            title,
            excerpt: input.excerpt?.trim() || null,
            status: input.status,
            featuredRank: parseFeaturedRank(input.featuredRank),
            heroBadge: input.heroBadge?.trim() || null,
            heroTitleHtml: sanitizeHeroTitleHtml(input.heroTitleHtml, title),
            heroSubtitle: input.heroSubtitle?.trim() || null,
            metaTitle: input.metaTitle?.trim() || null,
            metaDescription: input.metaDescription?.trim() || null,
            canonicalUrl: input.canonicalUrl?.trim() || null,
            keywords: parseKeywords(input.keywords),
            publishedAt,
            featuredImageId,
            openGraphImageId,
            readingTimeMins,
            categories: {
              set: input.categoryIds.map((id) => ({ id }))
            }
          }
        })
      : await transaction.post.create({
          data: {
            slug,
            title,
            excerpt: input.excerpt?.trim() || null,
            status: input.status,
            featuredRank: parseFeaturedRank(input.featuredRank),
            heroBadge: input.heroBadge?.trim() || null,
            heroTitleHtml: sanitizeHeroTitleHtml(input.heroTitleHtml, title),
            heroSubtitle: input.heroSubtitle?.trim() || null,
            metaTitle: input.metaTitle?.trim() || null,
            metaDescription: input.metaDescription?.trim() || null,
            canonicalUrl: input.canonicalUrl?.trim() || null,
            keywords: parseKeywords(input.keywords),
            publishedAt,
            featuredImageId,
            openGraphImageId,
            readingTimeMins,
            categories: {
              connect: input.categoryIds.map((id) => ({ id }))
            }
          }
        });

    await transaction.postSection.deleteMany({
      where: {
        postId: post.id
      }
    });

    if (sections.length > 0) {
      await transaction.postSection.createMany({
        data: sections.map((section, index) => ({
          postId: post.id,
          position: index,
          type: section.type,
          html: section.type === PostSectionType.RICH_TEXT ? section.html : null
        }))
      });
    }

    return post;
  });

  return persistedPost;
}

export async function saveCategory(input: SaveCategoryInput) {
  const db = getDb();
  const name = ensureCategoryName(input.name);
  const slug = slugify(input.slug || name);

  if (!slug) {
    throw new Error('No pudimos generar un slug válido para la categoría.');
  }

  const conflictingCategory = await db.category.findFirst({
    where: {
      slug,
      NOT: input.categoryId
        ? {
            id: input.categoryId
          }
        : undefined
    },
    select: {
      id: true
    }
  });

  if (conflictingCategory) {
    throw new Error('Ya existe otra categoría con ese slug.');
  }

  const cardImageId = await resolveImageId(input.cardImageId, input.cardImageFile, input.cardImageAlt);

  return input.categoryId
    ? db.category.update({
        where: {
          id: input.categoryId
        },
        data: {
          name,
          slug,
          description: input.description?.trim() || null,
          icon: input.icon,
          cardImageId
        }
      })
    : db.category.create({
        data: {
          name,
          slug,
          description: input.description?.trim() || null,
          icon: input.icon,
          cardImageId
        }
      });
}

export async function updatePostStatus(postId: string, status: PostStatus) {
  const db = getDb();

  return db.post.update({
    where: {
      id: postId
    },
    data: {
      status,
      publishedAt: status === PostStatus.PUBLISHED ? new Date() : undefined
    }
  });
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
    ],
    bodyHtml: renderPostSectionsHtml(post.sections),
    canonicalUrl: post.canonicalUrl?.trim() || undefined,
    publishedTime: post.publishedAt?.toISOString(),
    ogImage: resolvePostShareImage(post),
    metaTitle: post.metaTitle?.trim() || undefined,
    metaDescription: post.metaDescription?.trim() || undefined,
    jsonLd: [],
    navigation: [],
    categorySlug: post.categories[0]?.slug
  };
}

export function parseSavePostInput(formData: FormData): SavePostInput {
  return {
    postId: parseOptionalString(formData.get('postId')),
    title: parseOptionalString(formData.get('title')) || '',
    slug: parseOptionalString(formData.get('slug')),
    excerpt: parseOptionalString(formData.get('excerpt')),
    status: postStatusSchema.parse(parseOptionalString(formData.get('status')) || PostStatus.DRAFT),
    featuredRank: parseOptionalString(formData.get('featuredRank')),
    heroBadge: parseOptionalString(formData.get('heroBadge')),
    heroTitleHtml: parseOptionalString(formData.get('heroTitleHtml')),
    heroSubtitle: parseOptionalString(formData.get('heroSubtitle')),
    metaTitle: parseOptionalString(formData.get('metaTitle')),
    metaDescription: parseOptionalString(formData.get('metaDescription')),
    canonicalUrl: parseOptionalString(formData.get('canonicalUrl')),
    keywords: parseOptionalString(formData.get('keywords')),
    publishedAt: parseOptionalString(formData.get('publishedAt')),
    categoryIds: parseCategoryIds(formData),
    featuredImageId: parseOptionalString(formData.get('featuredImageId')),
    openGraphImageId: parseOptionalString(formData.get('openGraphImageId')),
    featuredImageAlt: parseOptionalString(formData.get('featuredImageAlt')),
    openGraphImageAlt: parseOptionalString(formData.get('openGraphImageAlt')),
    sections: parseSectionsJson(formData),
    featuredImageFile: formData.get('featuredImageFile') instanceof File ? (formData.get('featuredImageFile') as File) : undefined,
    openGraphImageFile: formData.get('openGraphImageFile') instanceof File ? (formData.get('openGraphImageFile') as File) : undefined
  };
}

export function parseSaveCategoryInput(formData: FormData): SaveCategoryInput {
  return {
    categoryId: parseOptionalString(formData.get('categoryId')),
    name: parseOptionalString(formData.get('name')) || '',
    slug: parseOptionalString(formData.get('slug')),
    description: parseOptionalString(formData.get('description')),
    icon: categoryIconSchema.parse(parseOptionalString(formData.get('icon')) || CategoryIcon.DOCUMENT),
    cardImageId: parseOptionalString(formData.get('cardImageId')),
    cardImageAlt: parseOptionalString(formData.get('cardImageAlt')),
    cardImageFile: formData.get('cardImageFile') instanceof File ? (formData.get('cardImageFile') as File) : undefined
  };
}
