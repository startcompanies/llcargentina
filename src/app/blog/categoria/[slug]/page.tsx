import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogCategoryPage } from '@/components/blog/BlogCategoryPage/BlogCategoryPage';
import { getBlogCategoryContent } from '@/lib/blog-content';
import { getLocale } from '@/i18n/get-locale';
import { siteUrl } from '@/i18n/config';

export const dynamic = 'force-dynamic';

type CategoriaSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoriaSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogCategoryContent(slug);
  if (!data) return {};

  const canonical = `${siteUrl}/noticias/categoria/${slug}`;

  return {
    title: `${data.categoryName} - Blog`,
    description: data.description || `Explorá todos los artículos sobre ${data.categoryName}.`,
    alternates: { canonical },
    openGraph: {
      title: `${data.categoryName} - Blog LLC Argentina`,
      locale: 'es_LA',
    },
  };
}

export default async function BlogCategoriaSlugPage({ params }: CategoriaSlugPageProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);

  // English version not available
  if (locale === 'en') notFound();

  const data = await getBlogCategoryContent(slug);
  if (!data) notFound();

  return <BlogCategoryPage data={data} locale="es" />;
}
