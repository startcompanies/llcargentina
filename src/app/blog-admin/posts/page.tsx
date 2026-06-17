import type { Metadata } from 'next';
import { AdminShell } from '@/components/blog-admin/AdminShell/AdminShell';
import { BlogPostsDashboard } from '@/components/blog-admin/BlogPostsDashboard/BlogPostsDashboard';
import { requireBlogAdminSession } from '@/lib/blog-admin-auth';
import { getBlogAdminPosts } from '@/lib/blog-admin-data';

type BlogAdminPostsPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog - Blog Admin'
};

function resolveNotice(status?: string, error?: string) {
  if (error) {
    return {
      tone: 'error' as const,
      message: error
    };
  }

  if (status === 'archived') {
    return {
      tone: 'success' as const,
      message: 'El post fue archivado.'
    };
  }

  return undefined;
}

export default async function BlogAdminPostsPage({ searchParams }: BlogAdminPostsPageProps) {
  await requireBlogAdminSession();
  const [posts, params] = await Promise.all([getBlogAdminPosts(), searchParams]);

  return (
    <AdminShell
      currentPath="/blog-admin/posts"
      title="Blog"
      description="Gestioná el inventario completo de artículos, su estado editorial y los accesos a preview."
      notice={resolveNotice(params.status, params.error)}
    >
      <BlogPostsDashboard posts={posts} />
    </AdminShell>
  );
}
