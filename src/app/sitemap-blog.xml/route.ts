import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogArticlesFromDatabase } from '@/lib/blog-content-db';
import { isStagingHost, NOINDEX_VALUE } from '@/lib/noindex-headers';

export const dynamic = 'force-dynamic';

const siteUrl = 'https://llcargentina.com';

export async function GET(request: NextRequest) {
  let articles: Awaited<ReturnType<typeof getAllBlogArticlesFromDatabase>> = [];

  try {
    articles = await getAllBlogArticlesFromDatabase();
  } catch {
    // DB unavailable — return empty sitemap
  }

  const urls = articles.map((article) => {
    const path = `/blog/${article.slug}`;
    const lastmod = article.publishedTime
      ? new Date(article.publishedTime).toISOString()
      : new Date().toISOString();

    return `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
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
