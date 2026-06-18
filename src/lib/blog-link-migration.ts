import { load } from 'cheerio';
import { getDb } from '@/lib/db';
import { normalizeBlogHref } from '@/lib/blog-routes';

export function normalizeImportedBlogLinkHtml(html: string) {
  if (!html.includes('/blog/noticias/')) {
    return html;
  }

  const $ = load(html, null, false);

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');

    if (!href) {
      return;
    }

    const normalizedHref = normalizeBlogHref(href);

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
      html: {
        contains: '/blog/noticias/'
      }
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
