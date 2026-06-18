import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getAdminSession, isAuthenticatedSession } from '@/lib/auth';
import { repairImportedBlogImageUrls } from '@/lib/blog-image-migration';

export const runtime = 'nodejs';

export async function POST() {
  const session = await getAdminSession();

  if (!isAuthenticatedSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await repairImportedBlogImageUrls();

  revalidatePath('/blog');
  revalidatePath('/blog-admin/posts');
  revalidatePath('/sitemap.xml');
  revalidatePath('/sitemap-blog.xml');

  return NextResponse.json(result);
}
