import type { Metadata } from 'next';
import { AdminShell } from '@/components/blog-admin/AdminShell/AdminShell';
import { PostEditorForm } from '@/components/blog-admin/PostEditorForm/PostEditorForm';
import { savePostAction } from '@/app/blog-admin/actions';
import { requireBlogAdminSession } from '@/lib/blog-admin-auth';
import { getBlogAdminAssets, getBlogAdminCategories, getBlogAdminPostEditorData } from '@/lib/blog-admin-data';

type BlogAdminEditPostPageProps = {
  params: Promise<{
    postId: string;
  }>;
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editar post - Blog Admin'
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
      message: 'El post se guardó correctamente.'
    };
  }

  return undefined;
}

export default async function BlogAdminEditPostPage({ params, searchParams }: BlogAdminEditPostPageProps) {
  await requireBlogAdminSession();

  const [{ postId }, query] = await Promise.all([params, searchParams]);
  const [initialPost, categories, assets] = await Promise.all([
    getBlogAdminPostEditorData(postId),
    getBlogAdminCategories(),
    getBlogAdminAssets()
  ]);

  return (
    <AdminShell
      currentPath="/blog-admin/posts"
      title={initialPost.title || 'Editar post'}
      description="Actualizá el contenido, metadata, imágenes y estado editorial del artículo."
      notice={resolveNotice(query.status, query.error)}
    >
      <PostEditorForm
        action={savePostAction}
        initialPost={initialPost}
        categories={categories}
        assets={assets}
        redirectTo={`/blog-admin/posts/${postId}`}
        previewUrl={`/blog-admin/posts/${postId}/preview`}
        submitLabel="Guardar cambios"
      />
    </AdminShell>
  );
}
