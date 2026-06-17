import { headers } from 'next/headers';
import { type Locale, defaultLocale } from './config';

/** Read the current locale from the x-locale header (set by middleware). Server components only. */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const value = h.get('x-locale');
  return value === 'en' ? 'en' : defaultLocale;
}
