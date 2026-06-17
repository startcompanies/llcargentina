export type Locale = 'es' | 'en';
export const defaultLocale: Locale = 'es';
export const locales: Locale[] = ['es', 'en'];

export const siteUrl = 'https://llcargentina.com';

/** English slug → Spanish file-system route */
export const enToEsRouteMap: Record<string, string> = {};

/** Spanish file-system route → English slug */
export const esToEnRouteMap: Record<string, string> = Object.fromEntries(
  Object.entries(enToEsRouteMap).map(([en, es]) => [es, en])
);

/** Build a path for the given locale */
export function getLocalizedPath(esPath: string, locale: Locale): string {
  if (locale === 'es') return esPath;

  if (esPath === '/blog' || esPath.startsWith('/blog/')) {
    return esPath;
  }

  if (esPath === '/') return '/en';

  const segments = esPath.slice(1).split('/');
  const first = segments[0];
  const enSlug = esToEnRouteMap[first];

  if (enSlug) {
    segments[0] = enSlug;
    return `/en/${segments.join('/')}`;
  }

  return `/en${esPath}`;
}

/** Return canonical + alternate URLs for hreflang */
export function getAlternateUrls(esPath: string) {
  return {
    es: `${siteUrl}${esPath}`,
    en: `${siteUrl}${getLocalizedPath(esPath, 'en')}`
  };
}
