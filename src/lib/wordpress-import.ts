import fs from 'node:fs/promises';
import path from 'node:path';
import { CategoryIcon, PostSectionType, PostStatus } from '@prisma/client';
import { load } from 'cheerio';
import { XMLParser } from 'fast-xml-parser';
import { escapeHtml, estimateReadingTimeFromHtml, extractFirstImageFromHtml, renderPostSectionsHtml, sanitizePostHtml } from '@/lib/blog-html';
import { getDb } from '@/lib/db';
import { downloadRemoteMedia } from '@/lib/media-storage';
import { slugify } from '@/lib/slug';

type WordpressCategoryInput = {
  name: string;
  slug: string;
};

export type WordpressImportRecord = {
  sourceId?: string;
  sourceUrl?: string;
  title: string;
  slug: string;
  excerpt: string;
  html: string;
  sections?: Array<{
    type: PostSectionType;
    html: string;
  }>;
  status: PostStatus;
  publishedAt?: Date;
  featuredRank?: number | null;
  heroBadge?: string;
  heroTitleHtml?: string;
  heroSubtitle?: string;
  categories: WordpressCategoryInput[];
  featuredImageUrl?: string;
  openGraphImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords: string[];
};

export type WordpressImportResult = {
  imported: number;
  skipped: number;
  duplicateSlugs: string[];
  mediaErrors: Array<{ post: string; url: string; message: string }>;
};

type ImportOptions = {
  sourcePath: string;
  limit?: number;
};

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}

function readNodeText(node: unknown): string {
  if (typeof node === 'string') {
    return node.trim();
  }

  if (Array.isArray(node)) {
    return node.map(readNodeText).filter(Boolean).join(' ').trim();
  }

  if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>;
    return (
      readNodeText(record['#text']) ||
      readNodeText(record.__cdata) ||
      readNodeText(record['$text']) ||
      Object.values(record).map(readNodeText).filter(Boolean).join(' ').trim()
    );
  }

  return '';
}

function toPostStatus(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();

  if (normalized === 'publish' || normalized === 'published') {
    return PostStatus.PUBLISHED;
  }

  if (normalized === 'draft') {
    return PostStatus.DRAFT;
  }

  if (normalized === 'archived' || normalized === 'archive') {
    return PostStatus.ARCHIVED;
  }

  return PostStatus.ARCHIVED;
}

function extractExcerpt(html: string) {
  const text = load(html).text().replace(/\s+/g, ' ').trim();
  return text.slice(0, 220).trim();
}

function extractYoastKeywords(value: string | undefined) {
  return (value || '')
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseWordpressDate(value: string | undefined) {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function parseOptionalNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function parseSectionType(value: string | undefined) {
  const normalized = value?.trim().toUpperCase();

  if (normalized === PostSectionType.CTA_CONSULTATION) {
    return PostSectionType.CTA_CONSULTATION;
  }

  if (normalized === PostSectionType.CTA_PRICING) {
    return PostSectionType.CTA_PRICING;
  }

  if (normalized === PostSectionType.FAQ_MODULE) {
    return PostSectionType.FAQ_MODULE;
  }

  return PostSectionType.RICH_TEXT;
}

function parseJsonSections(value: unknown) {
  return asArray(value)
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const record = entry as Record<string, unknown>;
      const type = parseSectionType(readNodeText(record.type));
      const html = type === PostSectionType.RICH_TEXT ? readNodeText(record.html) : '';

      return {
        type,
        html
      };
    })
    .filter((section): section is { type: PostSectionType; html: string } => Boolean(section));
}

function normalizeRemoteUrl(url: string | undefined) {
  const trimmed = url?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return undefined;
}

function parseJsonRecord(input: Record<string, unknown>): WordpressImportRecord | null {
  const title =
    readNodeText(input.title) ||
    readNodeText((input.title as Record<string, unknown> | undefined)?.rendered) ||
    '';
  const slug = slugify(readNodeText(input.slug) || readNodeText(input.post_name) || title);
  const sections = parseJsonSections(input.sections);
  const html =
    readNodeText((input.content as Record<string, unknown> | undefined)?.rendered) ||
    readNodeText(input.content) ||
    readNodeText(input.html) ||
    (sections.length
      ? sections
          .filter((section) => section.type === PostSectionType.RICH_TEXT)
          .map((section) => section.html)
          .join('\n')
      : '');

  if (!title || !slug || (!html && sections.length === 0)) {
    return null;
  }

  const excerpt =
    readNodeText((input.excerpt as Record<string, unknown> | undefined)?.rendered) ||
    readNodeText(input.excerpt) ||
    extractExcerpt(html);
  const yoast = (input.yoast_head_json as Record<string, unknown> | undefined) || {};
  const categories = asArray(input.categories)
    .map((category) => {
      if (typeof category === 'string') {
        return {
          name: category,
          slug: slugify(category)
        };
      }

      if (category && typeof category === 'object') {
        const record = category as Record<string, unknown>;
        const name = readNodeText(record.name) || readNodeText(record.label);
        const categorySlug = slugify(readNodeText(record.slug) || name);

        if (!name || !categorySlug) {
          return null;
        }

        return {
          name,
          slug: categorySlug
        };
      }

      return null;
    })
    .filter((value): value is WordpressCategoryInput => Boolean(value));

  return {
    sourceId: readNodeText(input.id) || undefined,
    sourceUrl: readNodeText(input.link) || undefined,
    title,
    slug,
    excerpt,
    html,
    sections: sections.length ? sections : undefined,
    status: toPostStatus(readNodeText(input.status)),
    publishedAt: parseWordpressDate(readNodeText(input.publishedAt) || readNodeText(input.date) || readNodeText(input.date_gmt)),
    featuredRank: parseOptionalNumber(input.featuredRank),
    heroBadge: readNodeText(input.heroBadge) || undefined,
    heroTitleHtml: readNodeText(input.heroTitleHtml) || undefined,
    heroSubtitle: readNodeText(input.heroSubtitle) || undefined,
    categories,
    featuredImageUrl:
      normalizeRemoteUrl(readNodeText((yoast.og_image as Array<Record<string, unknown>> | undefined)?.[0]?.url)) ||
      normalizeRemoteUrl(readNodeText(input.featuredImageUrl)) ||
      normalizeRemoteUrl(readNodeText(input.featured_image_url)) ||
      normalizeRemoteUrl(readNodeText(input.featuredImage)),
    openGraphImageUrl:
      normalizeRemoteUrl(readNodeText(input.openGraphImageUrl)) ||
      normalizeRemoteUrl(readNodeText((yoast.og_image as Array<Record<string, unknown>> | undefined)?.[0]?.url)),
    metaTitle: readNodeText(input.metaTitle) || readNodeText(yoast.title) || undefined,
    metaDescription: readNodeText(input.metaDescription) || readNodeText(yoast.description) || undefined,
    canonicalUrl: readNodeText(input.canonicalUrl) || readNodeText(yoast.canonical) || undefined,
    keywords: Array.isArray(input.keywords)
      ? input.keywords.map((keyword) => readNodeText(keyword)).filter(Boolean)
      : extractYoastKeywords(readNodeText(input.keywords) || readNodeText(yoast.keywords))
  };
}

function extractWpMeta(item: Record<string, unknown>, key: string) {
  const postmeta = asArray(item['wp:postmeta']);

  for (const metaEntry of postmeta) {
    const metaRecord = metaEntry as Record<string, unknown>;

    if (readNodeText(metaRecord['wp:meta_key']) === key) {
      return readNodeText(metaRecord['wp:meta_value']) || undefined;
    }
  }

  return undefined;
}

function parseWordpressXml(xml: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseTagValue: false,
    trimValues: false
  });
  const parsed = parser.parse(xml) as Record<string, unknown>;
  const channel = (parsed.rss as Record<string, unknown> | undefined)?.channel as Record<string, unknown> | undefined;
  const items = asArray(channel?.item).map((item) => item as Record<string, unknown>);

  const attachmentById = new Map<string, string>();

  for (const item of items) {
    if (readNodeText(item['wp:post_type']) !== 'attachment') {
      continue;
    }

    const id = readNodeText(item['wp:post_id']);
    const url = normalizeRemoteUrl(readNodeText(item['wp:attachment_url']));

    if (id && url) {
      attachmentById.set(id, url);
    }
  }

  const records: WordpressImportRecord[] = [];

  for (const item of items) {
    if (readNodeText(item['wp:post_type']) !== 'post') {
      continue;
    }

    const title = readNodeText(item.title);
    const slug = slugify(readNodeText(item['wp:post_name']) || title);
    const html = readNodeText(item['content:encoded']);

    if (!title || !slug || !html) {
      continue;
    }

    const categories = asArray(item.category)
      .map((category) => {
        if (!category || typeof category !== 'object') {
          return null;
        }

        const record = category as Record<string, unknown>;
        if (record.domain !== 'category') {
          return null;
        }

        const name = readNodeText(record);
        const categorySlug = slugify(readNodeText(record.nicename) || name);

        if (!name || !categorySlug) {
          return null;
        }

        return {
          name,
          slug: categorySlug
        };
      })
      .filter((value): value is WordpressCategoryInput => Boolean(value));

    const thumbnailId = extractWpMeta(item, '_thumbnail_id');
    const yoastTitle = extractWpMeta(item, '_yoast_wpseo_title');
    const yoastDescription = extractWpMeta(item, '_yoast_wpseo_metadesc');
    const yoastCanonical = extractWpMeta(item, '_yoast_wpseo_canonical');
    const yoastKeywords = extractYoastKeywords(extractWpMeta(item, '_yoast_wpseo_focuskw'));

    records.push({
      sourceId: readNodeText(item['wp:post_id']) || undefined,
      sourceUrl: readNodeText(item.link) || undefined,
      title,
      slug,
      excerpt: readNodeText(item['excerpt:encoded']) || extractExcerpt(html),
      html,
      status: toPostStatus(readNodeText(item['wp:status'])),
      publishedAt: parseWordpressDate(readNodeText(item['wp:post_date_gmt']) || readNodeText(item.pubDate)),
      categories,
      featuredImageUrl: thumbnailId ? attachmentById.get(thumbnailId) : undefined,
      openGraphImageUrl: thumbnailId ? attachmentById.get(thumbnailId) : undefined,
      metaTitle: yoastTitle || undefined,
      metaDescription: yoastDescription || undefined,
      canonicalUrl: yoastCanonical || undefined,
      keywords: yoastKeywords
    });
  }

  return records;
}

async function loadImportRecords(sourcePath: string) {
  const absolutePath = path.isAbsolute(sourcePath) ? sourcePath : path.join(process.cwd(), sourcePath);
  const raw = await fs.readFile(absolutePath, 'utf8');
  const extension = path.extname(absolutePath).toLowerCase();

  if (extension === '.json') {
    const parsed = JSON.parse(raw) as unknown;
    const records = Array.isArray(parsed)
      ? parsed
      : asArray((parsed as Record<string, unknown>)?.posts).length
        ? asArray((parsed as Record<string, unknown>)?.posts)
        : asArray((parsed as Record<string, unknown>)?.items);

    return records
      .map((record) => (record && typeof record === 'object' ? parseJsonRecord(record as Record<string, unknown>) : null))
      .filter((value): value is WordpressImportRecord => Boolean(value));
  }

  return parseWordpressXml(raw);
}

async function persistDownloadedMedia(url: string, mediaErrors: WordpressImportResult['mediaErrors'], postSlug: string, mediaCache: Map<string, string>) {
  if (mediaCache.has(url)) {
    return mediaCache.get(url) || null;
  }

  try {
    const stored = await downloadRemoteMedia(url);
    const db = getDb();
    const asset = await db.mediaAsset.create({
      data: {
        storageKey: stored.storageKey,
        url: stored.url,
        alt: stored.alt,
        mimeType: stored.mimeType,
        fileName: stored.fileName,
        sizeBytes: stored.sizeBytes
      }
    });

    mediaCache.set(url, asset.id);
    return asset.id;
  } catch (error) {
    mediaErrors.push({
      post: postSlug,
      url,
      message: error instanceof Error ? error.message : 'Unknown media error'
    });

    return null;
  }
}

async function rewriteImportedImages(
  html: string,
  postSlug: string,
  mediaErrors: WordpressImportResult['mediaErrors'],
  mediaCache: Map<string, string>
) {
  const db = getDb();
  const $ = load(html || '');
  let firstAssetId: string | null = null;

  for (const image of $('img[src]').toArray()) {
    const currentSrc = $(image).attr('src');
    const normalizedUrl = normalizeRemoteUrl(currentSrc);

    if (!normalizedUrl) {
      continue;
    }

    const assetId = await persistDownloadedMedia(normalizedUrl, mediaErrors, postSlug, mediaCache);

    if (!assetId) {
      continue;
    }

    if (!firstAssetId) {
      firstAssetId = assetId;
    }

    const asset = await db.mediaAsset.findUnique({
      where: {
        id: assetId
      },
      select: {
        url: true
      }
    });

    if (asset?.url) {
      $(image).attr('src', asset.url);
      $(image).removeAttr('srcset');
      $(image).removeAttr('sizes');
    }
  }

  return {
    html: $.root().html() || html,
    firstAssetId
  };
}

async function prepareImportedSections(
  record: WordpressImportRecord,
  mediaErrors: WordpressImportResult['mediaErrors'],
  mediaCache: Map<string, string>
) {
  const sourceSections = record.sections?.length
    ? record.sections
    : [
        {
          type: PostSectionType.RICH_TEXT,
          html: record.html
        }
      ];

  const preparedSections: Array<{ type: PostSectionType; html: string }> = [];
  let firstAssetId: string | null = null;

  for (const section of sourceSections) {
    if (section.type !== PostSectionType.RICH_TEXT) {
      preparedSections.push({
        type: section.type,
        html: ''
      });
      continue;
    }

    const rewritten = await rewriteImportedImages(section.html || '', record.slug, mediaErrors, mediaCache);

    if (!firstAssetId && rewritten.firstAssetId) {
      firstAssetId = rewritten.firstAssetId;
    }

    preparedSections.push({
      type: PostSectionType.RICH_TEXT,
      html: sanitizePostHtml(rewritten.html)
    });
  }

  return {
    sections: preparedSections,
    firstAssetId
  };
}

async function upsertCategory(name: string, slug: string) {
  const db = getDb();

  return db.category.upsert({
    where: {
      slug
    },
    update: {
      name
    },
    create: {
      name,
      slug,
      icon: CategoryIcon.DOCUMENT
    }
  });
}

export async function importWordpressContent(options: ImportOptions): Promise<WordpressImportResult> {
  const db = getDb();
  const rawRecords = await loadImportRecords(options.sourcePath);
  const records = typeof options.limit === 'number' ? rawRecords.slice(0, options.limit) : rawRecords;
  const result: WordpressImportResult = {
    imported: 0,
    skipped: 0,
    duplicateSlugs: [],
    mediaErrors: []
  };
  const mediaCache = new Map<string, string>();

  for (const record of records) {
    const existingBySource = record.sourceId
      ? await db.post.findUnique({
          where: {
            sourceId: record.sourceId
          },
          select: {
            id: true
          }
        })
      : null;
    const existingBySlug = await db.post.findUnique({
      where: {
        slug: record.slug
      },
      select: {
        id: true
      }
    });

    if (!existingBySource && existingBySlug) {
      result.skipped += 1;
      result.duplicateSlugs.push(record.slug);
      continue;
    }

    const prepared = await prepareImportedSections(record, result.mediaErrors, mediaCache);
    const renderedSectionsHtml = renderPostSectionsHtml(prepared.sections);
    const categoryIds = [];

    for (const category of record.categories) {
      const savedCategory = await upsertCategory(category.name, category.slug);
      categoryIds.push(savedCategory.id);
    }

    const firstInlineImage = prepared.sections
      .filter((section) => section.type === PostSectionType.RICH_TEXT)
      .map((section) => extractFirstImageFromHtml(section.html))
      .find(Boolean);
    const featuredImageId =
      (record.featuredImageUrl
      ? await persistDownloadedMedia(record.featuredImageUrl, result.mediaErrors, record.slug, mediaCache)
      : null) ||
      prepared.firstAssetId ||
      (firstInlineImage
        ? await persistDownloadedMedia(firstInlineImage.src, result.mediaErrors, record.slug, mediaCache)
        : null);
    const openGraphImageId =
      (record.openGraphImageUrl
      ? await persistDownloadedMedia(record.openGraphImageUrl, result.mediaErrors, record.slug, mediaCache)
      : null) || featuredImageId;

    const data = {
      sourceType: 'wordpress',
      sourceId: record.sourceId || null,
      sourceUrl: record.sourceUrl || null,
      slug: record.slug,
      title: record.title,
      excerpt: record.excerpt || extractExcerpt(renderedSectionsHtml),
      status: record.status,
      featuredRank: record.featuredRank ?? null,
      heroBadge: record.heroBadge || record.categories[0]?.name || 'Blog',
      heroTitleHtml: record.heroTitleHtml || escapeHtml(record.title),
      heroSubtitle: record.heroSubtitle || record.excerpt || extractExcerpt(renderedSectionsHtml),
      metaTitle: record.metaTitle || null,
      metaDescription: record.metaDescription || record.excerpt || null,
      canonicalUrl: record.canonicalUrl || null,
      keywords: record.keywords,
      readingTimeMins: estimateReadingTimeFromHtml(renderedSectionsHtml),
      publishedAt: record.publishedAt || null,
      featuredImageId,
      openGraphImageId
    };

    const post = existingBySource
      ? await db.post.update({
          where: {
            id: existingBySource.id
          },
          data
        })
      : await db.post.create({
          data
        });

    await db.postSection.deleteMany({
      where: {
        postId: post.id
      }
    });

    if (prepared.sections.length > 0) {
      await db.postSection.createMany({
        data: prepared.sections.map((section, index) => ({
          postId: post.id,
          type: section.type,
          position: index,
          html: section.type === PostSectionType.RICH_TEXT ? section.html : ''
        }))
      });
    }

    await db.post.update({
      where: {
        id: post.id
      },
      data: {
        categories: {
          set: categoryIds.map((id) => ({ id }))
        }
      }
    });

    result.imported += 1;
  }

  return result;
}
