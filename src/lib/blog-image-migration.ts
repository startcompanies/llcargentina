import { load } from 'cheerio';
import { getDb } from '@/lib/db';

const STARTCOMPANIES_ORIGIN = 'https://startcompanies.io';
const INTERNAL_IMAGE_HOSTS = new Set([
  'llcargentina.com',
  'www.llcargentina.com',
  'llcargentina.io',
  'www.llcargentina.io',
  'localhost',
  '127.0.0.1'
]);

const IMAGE_URL_ATTRIBUTES = [
  'src',
  'data-src',
  'data-lazy-src',
  'data-original',
  'data-image',
  'poster'
];

const IMAGE_SRCSET_ATTRIBUTES = ['srcset', 'data-srcset'];

function isStartCompaniesRelativeUpload(value: string) {
  return value.startsWith('/uploads/blog/');
}

function isBlogUploadPath(pathname: string) {
  return pathname.startsWith('/uploads/blog/');
}

function normalizeNextImageUrl(value: string): string | undefined {
  if (!value.includes('/_next/image')) {
    return undefined;
  }

  try {
    const url = new URL(value, 'https://llcargentina.local');
    const imageUrl = url.searchParams.get('url');

    return imageUrl ? normalizeImportedImageUrl(imageUrl) : undefined;
  } catch {
    return undefined;
  }
}

function normalizeAbsoluteBlogUpload(value: string): string | undefined {
  if (!/^https?:\/\//i.test(value)) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (url.hostname === 'startcompanies.io' || url.hostname === 'www.startcompanies.io') {
      if (isBlogUploadPath(url.pathname)) {
        return `${STARTCOMPANIES_ORIGIN}${url.pathname}${url.search}${url.hash}`;
      }

      return value;
    }

    if (INTERNAL_IMAGE_HOSTS.has(url.hostname) && isBlogUploadPath(url.pathname)) {
      return `${STARTCOMPANIES_ORIGIN}${url.pathname}${url.search}${url.hash}`;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export function normalizeImportedImageUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  const normalizedNextImageUrl = normalizeNextImageUrl(trimmed);

  if (normalizedNextImageUrl) {
    return normalizedNextImageUrl;
  }

  if (isStartCompaniesRelativeUpload(trimmed)) {
    return `${STARTCOMPANIES_ORIGIN}${trimmed}`;
  }

  const normalizedAbsoluteUpload = normalizeAbsoluteBlogUpload(trimmed);

  if (normalizedAbsoluteUpload) {
    return normalizedAbsoluteUpload;
  }

  return trimmed;
}

function rewriteSrcset(value: string) {
  return value
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      const [url, descriptor] = trimmed.split(/\s+/, 2);
      const normalizedUrl = normalizeImportedImageUrl(url) || url;
      return descriptor ? `${normalizedUrl} ${descriptor}` : normalizedUrl;
    })
    .join(', ');
}

export function normalizeImportedImageHtml(html: string) {
  if (!html.includes('/uploads/blog/') && !html.includes('/_next/image')) {
    return html;
  }

  const $ = load(html, null, false);

  $('img, source, video').each((_, element) => {
    for (const attribute of IMAGE_URL_ATTRIBUTES) {
      const src = $(element).attr(attribute);

      if (src) {
        $(element).attr(attribute, normalizeImportedImageUrl(src) || src);
      }
    }

    for (const attribute of IMAGE_SRCSET_ATTRIBUTES) {
      const srcset = $(element).attr(attribute);

      if (srcset) {
        $(element).attr(attribute, rewriteSrcset(srcset));
      }
    }
  });

  return $.root().html() || html;
}

export async function repairImportedBlogImageUrls() {
  const db = getDb();
  const result = {
    mediaAssetsUpdated: 0,
    sectionsUpdated: 0
  };

  const mediaAssets = await db.mediaAsset.findMany({
    where: {
      storageKey: {
        startsWith: 'imported:/uploads/blog/'
      }
    },
    select: {
      id: true,
      url: true
    }
  });

  for (const asset of mediaAssets) {
    const normalizedUrl = normalizeImportedImageUrl(asset.url);

    if (normalizedUrl && normalizedUrl !== asset.url) {
      await db.mediaAsset.update({
        where: {
          id: asset.id
        },
        data: {
          url: normalizedUrl
        }
      });
      result.mediaAssetsUpdated += 1;
    }
  }

  const sections = await db.postSection.findMany({
    where: {
      OR: [
        {
          html: {
            contains: '/uploads/blog/'
          }
        },
        {
          html: {
            contains: '/_next/image'
          }
        }
      ]
    },
    select: {
      id: true,
      html: true
    }
  });

  for (const section of sections) {
    const html = section.html || '';
    const normalizedHtml = normalizeImportedImageHtml(html);

    if (normalizedHtml !== html) {
      await db.postSection.update({
        where: {
          id: section.id
        },
        data: {
          html: normalizedHtml
        }
      });
      result.sectionsUpdated += 1;
    }
  }

  return result;
}
