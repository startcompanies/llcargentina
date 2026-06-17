import type { Metadata } from 'next';
import { AdminShell } from '@/components/blog-admin/AdminShell/AdminShell';
import { BlogCategoriesManager } from '@/components/blog-admin/BlogCategoriesManager/BlogCategoriesManager';
import { requireBlogAdminSession } from '@/lib/blog-admin-auth';
import { getBlogAdminAssets, getBlogAdminCategoryRecords } from '@/lib/blog-admin-data';

type BlogAdminCategoriesPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Categorías - Blog Admin'
};

function resolveNotice(status?: string, error?: string) {
  if (error) {
    return {
      tone: 'error' as const,
      message: error
    };
  }

  if (status === 'saved') {
    return {
      tone: 'success' as const,
      message: 'La categoría se guardó correctamente.'
    };
  }

  return undefined;
}

export default async function BlogAdminCategoriesPage({ searchParams }: BlogAdminCategoriesPageProps) {
  await requireBlogAdminSession();
  const [categories, assets, params] = await Promise.all([getBlogAdminCategoryRecords(), getBlogAdminAssets(), searchParams]);

  return (
    <AdminShell
      currentPath="/blog-admin/categories"
      title="Categorías de blog"
      description="Gestioná taxonomías, iconos e imágenes que alimentan la navegación y el índice de blog."
      notice={resolveNotice(params.status, params.error)}
    >
      <BlogCategoriesManager categories={categories} assets={assets} />
    </AdminShell>
  );
}
