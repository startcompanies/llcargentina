export const STAGING_HOST = 'staging.llcargentina.io';
export const NOINDEX_VALUE = 'noindex, nofollow';

export function isStagingHost(host: string): boolean {
  return host.includes(STAGING_HOST);
}

export function applyStagingNoindex(headers: Headers, host: string): void {
  if (isStagingHost(host)) {
    headers.set('X-Robots-Tag', NOINDEX_VALUE);
  }
}
