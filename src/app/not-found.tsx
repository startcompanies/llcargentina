import { SiteHeader } from '@/components/layout/SiteHeader/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter';
import { NotFoundContent } from '@/components/common/NotFoundContent/NotFoundContent';
import { getLocale } from '@/i18n/get-locale';

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <>
      <SiteHeader variant="transparent" />
      <NotFoundContent locale={locale} />
      <SiteFooter />
    </>
  );
}
