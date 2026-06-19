import { load } from 'cheerio';
import { getDb } from '@/lib/db';
import { normalizeBlogHref } from '@/lib/blog-routes';
import { PANEL_BASE_URL } from '@/lib/panel-links';

const LEGACY_PANEL_HOSTS = new Set([
  'panel.llcargentina.io',
  'panel-staging.llcargentina.io',
  'panel.llcargentina.com',
  'panel-staging.llcargentina.com'
]);

function normalizePanelPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/g, '') || '/';

  if (normalized === '/en/llc-opening') {
    return '/apertura-llc';
  }

  if (normalized === '/en/llc-renewal') {
    return '/renovar-llc';
  }

  return normalized;
}

function normalizePanelHref(value: string) {
  if (!/^https?:\/\//i.test(value)) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (!LEGACY_PANEL_HOSTS.has(url.hostname)) {
      return undefined;
    }

    const pathname = normalizePanelPath(url.pathname);
    const suffix = `${url.search}${url.hash}`;

    return `${PANEL_BASE_URL}${pathname === '/' ? '/' : pathname}${suffix}`;
  } catch {
    return undefined;
  }
}

export function normalizeImportedBlogLinkHtml(html: string) {
  if (!html.includes('/blog/noticias/') && !html.includes('panel.llcargentina.')) {
    return html;
  }

  const $ = load(html, null, false);

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');

    if (!href) {
      return;
    }

    const normalizedHref = normalizePanelHref(href) || normalizeBlogHref(href);

    if (normalizedHref && normalizedHref !== href) {
      $(element).attr('href', normalizedHref);
    }
  });

  return $.root().html() || html;
}

export async function repairImportedBlogLinks() {
  const db = getDb();
  const result = {
    sectionsUpdated: 0
  };

  const sections = await db.postSection.findMany({
    where: {
      OR: [
        {
          html: {
            contains: '/blog/noticias/'
          }
        },
        {
          html: {
            contains: 'panel.llcargentina.'
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
    const normalizedHtml = normalizeImportedBlogLinkHtml(html);

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
