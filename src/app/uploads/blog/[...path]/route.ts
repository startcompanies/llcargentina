import path from 'node:path';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const MIME_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif'
};

function resolveMimeType(fileName: string) {
  return MIME_BY_EXTENSION[path.extname(fileName).toLowerCase()] || 'application/octet-stream';
}

function getS3Client() {
  return new S3Client({
    region: (process.env.AWS_REGION ?? 'us-east-1').trim(),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!.trim(),
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!.trim(),
    },
  });
}

export async function GET(_: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;

  if (!segments?.length || segments.some((s) => s.includes('..'))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const bucket = process.env.S3_BUCKET_NAME?.trim();
  if (!bucket) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  }

  const s3Key = `blog/${segments.join('/')}`;

  try {
    const out = await getS3Client().send(
      new GetObjectCommand({ Bucket: bucket, Key: s3Key })
    );

    if (!out.Body) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of out.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }

    return new NextResponse(Buffer.concat(chunks), {
      headers: {
        'Content-Type': out.ContentType || resolveMimeType(segments[segments.length - 1]),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
