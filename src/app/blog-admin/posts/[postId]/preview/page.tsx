import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticlePage } from '@/components/blog/BlogArticlePage/BlogArticlePage';
import { requireBlogAdminSession } from '@/lib/blog-admin-auth';
import { getBlogAdminPreviewArticle } from '@/lib/blog-admin-data';

type BlogAdminPreviewPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Preview de Post - Blog Admin',
  robots: {
    index: false,
    follow: true
  }
};

export default async function BlogAdminPreviewPage({ params }: BlogAdminPreviewPageProps) {
  await requireBlogAdminSession();
  const { postId } = await params;
  const article = await getBlogAdminPreviewArticle(postId);

  if (!article) {
    notFound();
  }

  return <BlogArticlePage article={article} locale="es" />;
}
