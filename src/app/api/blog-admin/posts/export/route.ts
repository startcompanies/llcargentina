import { NextResponse } from 'next/server';
import { getAdminSession, isAuthenticatedSession } from '@/lib/auth';
import { getBlogPostsExportRecords } from '@/lib/blog-export';

export async function GET() {
  const session = await getAdminSession();

  if (!isAuthenticatedSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const records = await getBlogPostsExportRecords();
  const payload = JSON.stringify(records, null, 2);

  return new NextResponse(payload, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="llcargentina-blog-posts.json"',
      'Cache-Control': 'no-store'
    }
  });
}
