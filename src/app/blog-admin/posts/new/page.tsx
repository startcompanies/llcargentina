import type { Metadata } from 'next';
import { AdminShell } from '@/components/blog-admin/AdminShell/AdminShell';
import { PostEditorForm } from '@/components/blog-admin/PostEditorForm/PostEditorForm';
import { savePostAction } from '@/app/blog-admin/actions';
import { requireBlogAdminSession } from '@/lib/blog-admin-auth';
import { getBlogAdminAssets, getBlogAdminCategories, getBlogAdminPostEditorData } from '@/lib/blog-admin-data';

type BlogAdminNewPostPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nuevo post - Blog Admin'
};

export default async function BlogAdminNewPostPage({ searchParams }: BlogAdminNewPostPageProps) {
  await requireBlogAdminSession();
  const [initialPost, categories, assets, params] = await Promise.all([
    getBlogAdminPostEditorData(),
    getBlogAdminCategories(),
    getBlogAdminAssets(),
    searchParams
  ]);

  return (
    <AdminShell
      currentPath="/blog-admin/posts"
      title="Nuevo post"
      description="Creá un artículo nuevo con rich text, CTAs curados, metadata SEO y assets propios."
      notice={params.error ? { tone: 'error', message: params.error } : undefined}
    >
      <PostEditorForm
        action={savePostAction}
        initialPost={initialPost}
        categories={categories}
        assets={assets}
        redirectTo="/blog-admin/posts/new"
        submitLabel="Crear post"
      />
    </AdminShell>
  );
}
