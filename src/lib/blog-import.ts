import { CategoryIcon, Prisma, PostSectionType, PostStatus } from '@prisma/client';
import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { normalizeImportedImageHtml, normalizeImportedImageUrl } from '@/lib/blog-image-migration';
import { escapeHtml, estimateReadingTimeFromHtml, renderPostSectionsHtml, sanitizePostHtml } from '@/lib/blog-html';
import { getDb } from '@/lib/db';
import { slugify } from '@/lib/slug';

const STARTCOMPANIES_ORIGIN_PATTERN = /^https?:\/\/(www\.)?startcompanies\.io/i;
const STARTCOMPANIES_TEXT_PATTERN = /\bStart\s*Companies\b|\bStartCompanies\b|\bstartcompanies\b/gi;

const exportedSectionSchema = z.object({
  type: z.nativeEnum(PostSectionType),
  html: z.string().optional().default('')
});

const exportedPostSchema = z.object({
  sourceType: z.string().optional(),
  sourceId: z.string().optional(),
  sourceUrl: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional().default(''),
  status: z.nativeEnum(PostStatus).catch(PostStatus.DRAFT),
  publishedAt: z.string().optional(),
  featuredRank: z.number().int().nullable().optional(),
  heroBadge: z.string().optional(),
  heroTitleHtml: z.string().optional(),
  heroSubtitle: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  keywords: z.array(z.string()).optional().default([]),
  categories: z
    .array(
      z.object({
        name: z.string(),
        slug: z.string()
      })
    )
    .optional()
    .default([]),
  featuredImageUrl: z.string().optional(),
  featuredImageAlt: z.string().optional(),
  openGraphImageUrl: z.string().optional(),
  openGraphImageAlt: z.string().optional(),
  html: z.string().optional().default(''),
  sections: z.array(exportedSectionSchema).optional().default([])
});

const blogExportPayloadSchema = z.array(exportedPostSchema);

type ExportedPost = z.infer<typeof exportedPostSchema>;

export type BlogImportResult = {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{
    slug?: string;
    title?: string;
    message: string;
  }>;
};

function normalizeBrandText(value: string | undefined) {
  return value?.replace(STARTCOMPANIES_TEXT_PATTERN, 'LLC Argentina').trim();
}

function normalizeStartCompaniesUrl(value: string | undefined) {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.replace(STARTCOMPANIES_ORIGIN_PATTERN, 'https://llcargentina.com');
}

function normalizeVisibleText(value: string) {
  return value
    .replace(STARTCOMPANIES_ORIGIN_PATTERN, 'https://llcargentina.com')
    .replace(STARTCOMPANIES_TEXT_PATTERN, 'LLC Argentina');
}

function sanitizeImportedHeroTitle(value: string | undefined, fallbackTitle: string) {
  const normalized = normalizeBrandText(value);

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

function normalizeImportedHtml(value: string) {
  const html = sanitizePostHtml(value || '');
  const $ = load(html, null, false);

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');

    if (href) {
      $(element).attr('href', normalizeStartCompaniesUrl(href) || href);
    }
  });

  $.root()
    .find('*')
    .contents()
    .each((_, node) => {
      if (node.type === 'text' && 'data' in node && typeof node.data === 'string') {
        node.data = normalizeVisibleText(node.data);
      }
    });

  return normalizeImportedImageHtml($.root().html() || '');
}

function parsePublishedAt(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('La fecha de publicación no es válida.');
  }

  return parsed;
}

function fileNameFromUrl(url: string) {
  try {
    const parsed = new URL(url, 'https://llcargentina.com');
    return parsed.pathname.split('/').pop() || 'asset';
  } catch {
    return url.split('/').pop()?.split('?')[0] || 'asset';
  }
}

function mediaStorageKey(url: string) {
  return `imported:${url}`;
}

async function resolveImportedMediaAsset(
  transaction: Prisma.TransactionClient,
  url: string | undefined,
  alt: string | undefined
) {
  const normalizedUrl = normalizeImportedImageUrl(url);

  if (!normalizedUrl) {
    return null;
  }

  return transaction.mediaAsset.upsert({
    where: {
      storageKey: mediaStorageKey(normalizedUrl)
    },
    create: {
      storageKey: mediaStorageKey(normalizedUrl),
      url: normalizedUrl,
      alt: normalizeBrandText(alt) || null,
      fileName: fileNameFromUrl(normalizedUrl)
    },
    update: {
      alt: normalizeBrandText(alt) || null,
      fileName: fileNameFromUrl(normalizedUrl)
    }
  });
}

function getImportedSections(record: ExportedPost) {
  const sections = record.sections.length
    ? record.sections
    : [
        {
          type: PostSectionType.RICH_TEXT,
          html: record.html
        }
      ];

  return sections.map((section) => ({
    type: section.type,
    html: section.type === PostSectionType.RICH_TEXT ? normalizeImportedHtml(section.html) : ''
  }));
}

async function importOnePost(record: ExportedPost) {
  const db = getDb();
  const title = normalizeBrandText(record.title);

  if (!title) {
    throw new Error('El título del post es obligatorio.');
  }

  const slug = slugify(record.slug || title);

  if (!slug) {
    throw new Error('No pudimos generar un slug válido.');
  }

  const sourceId = record.sourceId?.trim() || `startcompanies:${slug}`;
  const sourceType = record.sourceType?.trim() || 'startcompanies-blog-export';
  const publishedAt = parsePublishedAt(record.publishedAt);
  const sections = getImportedSections(record);
  const readingTimeMins = estimateReadingTimeFromHtml(renderPostSectionsHtml(sections));

  return db.$transaction(async (transaction) => {
    const categoryRecords = await Promise.all(
      record.categories.map((category) => {
        const categoryName = normalizeBrandText(category.name);

        if (!categoryName) {
          throw new Error(`La categoría "${category.name}" no es válida.`);
        }

        const categorySlug = slugify(category.slug || categoryName);

        if (!categorySlug) {
          throw new Error(`La categoría "${category.name}" no es válida.`);
        }

        return transaction.category.upsert({
          where: {
            slug: categorySlug
          },
          create: {
            name: categoryName,
            slug: categorySlug,
            icon: CategoryIcon.DOCUMENT
          },
          update: {
            name: categoryName
          }
        });
      })
    );

    const [featuredImage, openGraphImage] = await Promise.all([
      resolveImportedMediaAsset(transaction, record.featuredImageUrl, record.featuredImageAlt),
      resolveImportedMediaAsset(transaction, record.openGraphImageUrl, record.openGraphImageAlt)
    ]);

    const existingPost = await transaction.post.findFirst({
      where: {
        OR: [
          {
            sourceId
          },
          {
            slug
          }
        ]
      },
      select: {
        id: true
      }
    });

    const data = {
      sourceType,
      sourceId,
      sourceUrl: record.sourceUrl?.trim() || null,
      slug,
      title,
      excerpt: normalizeBrandText(record.excerpt) || null,
      status: record.status,
      featuredRank: record.featuredRank ?? null,
      heroBadge: normalizeBrandText(record.heroBadge) || null,
      heroTitleHtml: sanitizeImportedHeroTitle(record.heroTitleHtml, title),
      heroSubtitle: normalizeBrandText(record.heroSubtitle) || null,
      metaTitle: normalizeBrandText(record.metaTitle) || null,
      metaDescription: normalizeBrandText(record.metaDescription) || null,
      canonicalUrl: normalizeStartCompaniesUrl(record.canonicalUrl) || null,
      keywords: record.keywords.map((keyword) => normalizeBrandText(keyword)).filter((keyword): keyword is string => Boolean(keyword)),
      publishedAt,
      featuredImageId: featuredImage?.id || null,
      openGraphImageId: openGraphImage?.id || null,
      readingTimeMins,
      categories: existingPost
        ? {
            set: categoryRecords.map((category) => ({ id: category.id }))
          }
        : {
            connect: categoryRecords.map((category) => ({ id: category.id }))
          }
    };

    const post = existingPost
      ? await transaction.post.update({
          where: {
            id: existingPost.id
          },
          data
        })
      : await transaction.post.create({
          data
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

    return existingPost ? 'updated' : 'created';
  });
}

export async function importBlogPostsFromExport(payload: unknown): Promise<BlogImportResult> {
  const records = blogExportPayloadSchema.parse(payload);
  const result: BlogImportResult = {
    total: records.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: []
  };

  for (const record of records) {
    try {
      const status = await importOnePost(record);

      if (status === 'created') {
        result.created += 1;
      } else {
        result.updated += 1;
      }
    } catch (error) {
      result.skipped += 1;
      result.errors.push({
        slug: record.slug,
        title: record.title,
        message: error instanceof Error ? error.message : 'No pudimos importar el post.'
      });
    }
  }

  return result;
}
