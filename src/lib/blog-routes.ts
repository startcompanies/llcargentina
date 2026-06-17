const NON_BLOG_EXACT_PATHS = new Set(['/', '/blog', '/blog-admin']);
const NON_BLOG_PREFIX_PATHS = ['/api/', '/img/', '/js/', '/brand/', '/uploads/', '/fonts/', '/wp-content/', '/blog-admin/', '/_next/'];
const NON_BLOG_FILE_EXTENSIONS = /\.(pdf|png|jpe?g|webp|svg|gif|zip|docx?|xlsx?|csv|txt)$/i;
const INTERNAL_CONTENT_HOSTS = new Set([
  'llcargentina.io',
  'www.llcargentina.io',
  'llcargentina.com',
  'www.llcargentina.com',
  'localhost',
  '127.0.0.1'
]);

function normalizePathname(pathname: string) {
  if (!pathname) {
    return '/';
  }

  const normalized = pathname === '/index.html' ? '/' : pathname.replace(/\.html$/i, '');
  return normalized !== '/' ? normalized.replace(/\/+$/g, '') || '/' : '/';
}

function normalizeBlogPath(pathname: string) {
  return /^\/blog\/blog-/.test(pathname)
    ? pathname.replace('/blog/blog-', '/blog/')
    : pathname;
}

export function getBlogPostPath(slug: string) {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
  return `/blog/${normalizedSlug}`;
}

export function normalizeBlogHref(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith('#') || trimmed.startsWith('?') || /^(mailto:|tel:|javascript:)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);

      if (!INTERNAL_CONTENT_HOSTS.has(url.hostname)) {
        return trimmed;
      }

      return normalizeBlogHref(`${url.pathname}${url.search}${url.hash}`);
    } catch {
      return trimmed;
    }
  }

  const parsed = new URL(trimmed, 'https://llcargentina.local');
  const pathname = normalizePathname(parsed.pathname.startsWith('/') ? parsed.pathname : `/${parsed.pathname}`);
  const suffix = `${parsed.search}${parsed.hash}`;

  if (pathname === '/precios') {
    return '/#precios';
  }

  if (pathname === '/agendar' || pathname === '/contacto') {
    return 'https://wa.me/17869354213?text=Hola%2C%20quiero%20abrir%20mi%20LLC';
  }

  if (pathname.startsWith('/blog/')) {
    return `${normalizeBlogPath(pathname)}${suffix}`;
  }

  if (
    NON_BLOG_EXACT_PATHS.has(pathname) ||
    NON_BLOG_PREFIX_PATHS.some((prefix) => pathname.startsWith(prefix)) ||
    NON_BLOG_FILE_EXTENSIONS.test(pathname)
  ) {
    return `${pathname}${suffix}`;
  }

  return `${getBlogPostPath(pathname.replace(/^\//, ''))}${suffix}`;
}

export function getBlogSlugFromHref(value?: string) {
  const normalized = normalizeBlogHref(value);

  if (!normalized) return undefined;
  if (normalized.startsWith('/blog/')) {
    return normalized.slice('/blog/'.length).split(/[?#]/, 1)[0] || undefined;
  }
  return undefined;
}
