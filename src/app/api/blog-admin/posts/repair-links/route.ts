import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getAdminSession, isAuthenticatedSession } from '@/lib/auth';
import { repairImportedBlogLinks } from '@/lib/blog-link-migration';

export const runtime = 'nodejs';

export async function POST() {
  const session = await getAdminSession();

  if (!isAuthenticatedSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await repairImportedBlogLinks();

  revalidatePath('/blog');
  revalidatePath('/blog-admin/posts');

  return NextResponse.json(result);
}
