import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getAdminSession, isAuthenticatedSession } from '@/lib/auth';
import { importBlogPostsFromExport } from '@/lib/blog-import';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!isAuthenticatedSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Subí un archivo JSON exportado desde el blog admin.' }, { status: 400 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(await file.text());
  } catch {
    return NextResponse.json({ error: 'El archivo no tiene un JSON válido.' }, { status: 400 });
  }

  try {
    const result = await importBlogPostsFromExport(payload);

    revalidatePath('/blog');
    revalidatePath('/blog-admin/posts');
    revalidatePath('/sitemap.xml');
    revalidatePath('/sitemap-blog.xml');

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'No pudimos importar los posts.'
      },
      { status: 400 }
    );
  }
}
