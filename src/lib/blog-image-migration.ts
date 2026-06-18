import { load } from 'cheerio';
import { getDb } from '@/lib/db';

const STARTCOMPANIES_ORIGIN = 'https://startcompanies.io';

function isStartCompaniesRelativeUpload(value: string) {
  return value.startsWith('/uploads/blog/');
}

export function normalizeImportedImageUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (isStartCompaniesRelativeUpload(trimmed)) {
    return `${STARTCOMPANIES_ORIGIN}${trimmed}`;
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
  if (!html.includes('/uploads/blog/')) {
    return html;
  }

  const $ = load(html, null, false);

  $('img[src], source[src]').each((_, element) => {
    const src = $(element).attr('src');

    if (src) {
      $(element).attr('src', normalizeImportedImageUrl(src) || src);
    }
  });

  $('img[srcset], source[srcset]').each((_, element) => {
    const srcset = $(element).attr('srcset');

    if (srcset) {
      $(element).attr('srcset', rewriteSrcset(srcset));
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
      html: {
        contains: '/uploads/blog/'
      },
      post: {
        sourceType: {
          contains: 'startcompanies'
        }
      }
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
