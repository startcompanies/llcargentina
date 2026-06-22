import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/blog/BlogIndexPage/BlogIndexPage';
import { getBlogIndexContent } from '@/lib/blog-content';
import { getLocale } from '@/i18n/get-locale';
import { siteUrl } from '@/i18n/config';

export const dynamic = 'force-dynamic';

type BlogPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const canonical = page > 1
    ? `${siteUrl}/blog?page=${page}`
    : `${siteUrl}/blog`;

  return {
    title: 'Blog',
    description: 'Guías, tutoriales y recursos para emprendedores de LATAM que operan en EE.UU.',
    alternates: { canonical },
    openGraph: {
      title: 'Blog - LLC Argentina',
      description: 'Guías, tutoriales y recursos para emprendedores de LATAM que operan en EE.UU.',
      locale: 'es_LA',
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);

  // English version not available — only ES content
  if (locale === 'en') {
    const { notFound } = await import('next/navigation');
    notFound();
  }

  const initialPage = Math.max(1, Number(params.page) || 1);
  const content = await getBlogIndexContent();

  return <BlogIndexPage content={content} locale="es" initialPage={initialPage} />;
}
