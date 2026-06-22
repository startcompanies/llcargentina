import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isStagingHost, NOINDEX_VALUE } from '@/lib/noindex-headers';

const enToEs: Record<string, string> = {};
const APEX_HOST = 'llcargentina.com';
const WWW_HOST = 'www.llcargentina.com';

function buildResponse(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/en')) {
    const response = NextResponse.next();
    response.headers.set('x-locale', 'es');
    return response;
  }

  const rest = pathname.slice(3); // strip '/en'
  const url = request.nextUrl.clone();

  // /en/blog/* has no English version — redirect permanently to the Spanish URL.
  if (rest === '/blog' || rest.startsWith('/blog/')) {
    url.pathname = rest;
    return NextResponse.redirect(url, 308);
  }

  // /en or /en/ → home
  if (!rest || rest === '/') {
    url.pathname = '/';
    const res = NextResponse.rewrite(url);
    res.headers.set('x-locale', 'en');
    return res;
  }

  const segments = rest.slice(1).split('/');
  const first = segments[0];

  // Known English routes → map to Spanish file paths
  const esRoute = enToEs[first];
  if (esRoute) {
    segments[0] = esRoute;
    url.pathname = `/${segments.join('/')}`;
    const res = NextResponse.rewrite(url);
    res.headers.set('x-locale', 'en');
    return res;
  }

  // Everything else (blog, blog slugs, etc.) → strip /en prefix
  url.pathname = rest;
  const res = NextResponse.rewrite(url);
  res.headers.set('x-locale', 'en');
  return res;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';

  if (host === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = WWW_HOST;
    return NextResponse.redirect(url, 308);
  }

  const response = buildResponse(request);

  if (isStagingHost(host)) {
    response.headers.set('X-Robots-Tag', NOINDEX_VALUE);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|brand|img|uploads|sitemap\\.xml|llm\\.txt).*)']
};
