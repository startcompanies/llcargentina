import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticlePage } from '@/components/blog/BlogArticlePage/BlogArticlePage';
import { getBlogArticleBySlug, getRelatedArticles } from '@/lib/blog-content';
import { getLocale } from '@/i18n/get-locale';
import { siteUrl } from '@/i18n/config';

export const dynamic = 'force-dynamic';

type BlogSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);

  if (!article) return {};

  const canonical = article.canonicalUrl || `${siteUrl}/blog/${slug}`;
  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.description;

  return {
    title,
    description,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      locale: 'es_LA',
      images: article.ogImage ? [article.ogImage] : undefined,
    },
  };
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);

  // English version not available
  if (locale === 'en') notFound();

  const article = await getBlogArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(
    article.postId,
    article.categoryIds ?? [],
    3
  );

  return <BlogArticlePage article={article} locale="es" relatedArticles={relatedArticles} />;
}
