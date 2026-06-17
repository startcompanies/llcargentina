'use server';

import { PostStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import { requireBlogAdminSession } from '@/lib/blog-admin-auth';
import { getBlogPostPath } from '@/lib/blog-routes';
import { parseSaveCategoryInput, parseSavePostInput, saveCategory, savePost, updatePostStatus } from '@/lib/blog-admin-service';

function buildRedirectUrl(basePath: string, status: 'saved' | 'updated' | 'archived', error?: string) {
  const params = new URLSearchParams();

  if (error) {
    params.set('error', error);
  } else {
    params.set('status', status);
  }

  return `${basePath}?${params.toString()}`;
}

export async function savePostAction(formData: FormData) {
  await requireBlogAdminSession();

  const redirectTo = String(formData.get('redirectTo') || '/blog-admin/posts/new');
  let nextUrl: string;

  try {
    const savedPost = await savePost(parseSavePostInput(formData));

    revalidatePath('/blog');
    revalidatePath(getBlogPostPath(savedPost.slug));
    revalidatePath('/blog-admin/posts');
    nextUrl = buildRedirectUrl(`/blog-admin/posts/${savedPost.id}`, 'saved');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'No pudimos guardar el post.';
    nextUrl = buildRedirectUrl(redirectTo, 'saved', message);
  }

  redirect(nextUrl);
}

export async function updatePostStatusAction(formData: FormData) {
  await requireBlogAdminSession();

  const postId = String(formData.get('postId') || '');
  const slug = String(formData.get('slug') || '');
  const redirectTo = String(formData.get('redirectTo') || '/blog-admin/posts');
  let nextUrl: string;

  try {
    await updatePostStatus(postId, PostStatus.ARCHIVED);
    revalidatePath('/blog');

    if (slug) {
      revalidatePath(getBlogPostPath(slug));
    }

    revalidatePath('/blog-admin/posts');
    nextUrl = buildRedirectUrl(redirectTo, 'archived');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'No pudimos actualizar el estado del post.';
    nextUrl = buildRedirectUrl(redirectTo, 'updated', message);
  }

  redirect(nextUrl);
}

export async function saveCategoryAction(formData: FormData) {
  await requireBlogAdminSession();

  let nextUrl: string;

  try {
    await saveCategory(parseSaveCategoryInput(formData));
    revalidatePath('/blog');
    revalidatePath('/blog-admin/categories');
    nextUrl = buildRedirectUrl('/blog-admin/categories', 'saved');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'No pudimos guardar la categoría.';
    nextUrl = buildRedirectUrl('/blog-admin/categories', 'saved', message);
  }

  redirect(nextUrl);
}
