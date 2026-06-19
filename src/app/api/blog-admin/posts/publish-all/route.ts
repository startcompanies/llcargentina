import { PostStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const db = getDb();
  const now = new Date();

  const result = await db.post.updateMany({
    where: {
      status: {
        not: PostStatus.PUBLISHED
      }
    },
    data: {
      status: PostStatus.PUBLISHED,
      publishedAt: now
    }
  });

  return NextResponse.json({
    updated: result.count
  });
}
