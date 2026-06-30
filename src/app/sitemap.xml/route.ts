import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogArticlesFromDatabase, getPublishedCategorySlugsFromDatabase } from '@/lib/blog-content-db';
import { getLocalizedPath, siteUrl } from '@/i18n/config';
import { isStagingHost, NOINDEX_VALUE } from '@/lib/noindex-headers';

export const dynamic = 'force-dynamic';

function urlEntry(
  esPath: string,
  lastmod: string,
  changefreq: string,
  priority: string
) {
  const enPath = getLocalizedPath(esPath, 'en');
  return `
  <url>
    <loc>${siteUrl}${esPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}${esPath}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${enPath}"/>
  </url>`;
}

function urlEntryEsOnly(
  path: string,
  lastmod: string,
  changefreq: string,
  priority: string
) {
  return `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET(request: NextRequest) {
  const now = new Date().toISOString();

  const staticEntries = [
    urlEntry('/', now, 'weekly', '1.0'),
    urlEntryEsOnly('/noticias', now, 'daily', '0.8'),
  ];

  let blogEntries: string[] = [];
  let categoryEntries: string[] = [];
  try {
    const [articles, categorySlugs] = await Promise.all([
      getAllBlogArticlesFromDatabase(),
      getPublishedCategorySlugsFromDatabase(),
    ]);
    blogEntries = articles.map((article) => {
      const lastmod = article.publishedTime
        ? new Date(article.publishedTime).toISOString()
        : now;
      return urlEntryEsOnly(`/noticias/${article.slug}`, lastmod, 'monthly', '0.7');
    });
    categoryEntries = categorySlugs.map((slug) =>
      urlEntryEsOnly(`/noticias/categoria/${slug}`, now, 'weekly', '0.6')
    );
  } catch {
    // DB unavailable — return static pages only
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticEntries, ...categoryEntries, ...blogEntries].join('\n')}
</urlset>`;

  const host = request.headers.get('host') ?? '';
  const responseHeaders: Record<string, string> = {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  };
  if (isStagingHost(host)) {
    responseHeaders['X-Robots-Tag'] = NOINDEX_VALUE;
  }

  return new NextResponse(xml, { headers: responseHeaders });
}
