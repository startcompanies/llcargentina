import crypto from 'node:crypto';
import path from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

type StoredMediaInput = {
  buffer: Buffer;
  mimeType?: string;
  fileName?: string;
  alt?: string;
};

export type StoredMediaResult = {
  storageKey: string;
  url: string;
  mimeType?: string;
  fileName?: string;
  sizeBytes: number;
  alt?: string;
};

function getS3Client() {
  return new S3Client({
    region: (process.env.AWS_REGION ?? 'us-east-1').trim(),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!.trim(),
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!.trim(),
    },
  });
}

function getS3Config() {
  const bucket = process.env.S3_BUCKET_NAME?.trim();
  if (!bucket) throw new Error('S3_BUCKET_NAME is not set');
  return { bucket };
}

function sanitizeFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extensionFromFileName(fileName?: string) {
  if (!fileName) return '';
  return path.extname(fileName).toLowerCase();
}

function extensionFromMimeType(mimeType?: string) {
  switch (mimeType) {
    case 'image/jpeg': return '.jpg';
    case 'image/png': return '.png';
    case 'image/webp': return '.webp';
    case 'image/gif': return '.gif';
    case 'image/svg+xml': return '.svg';
    case 'image/avif': return '.avif';
    default: return '';
  }
}

export async function storeMediaFile(input: StoredMediaInput): Promise<StoredMediaResult> {
  const { bucket } = getS3Config();

  const originalName = sanitizeFileName(input.fileName || 'asset');
  const extension = extensionFromFileName(originalName) || extensionFromMimeType(input.mimeType) || '.bin';
  const baseName = originalName.replace(new RegExp(`${extension.replace('.', '\\.')}$`), '') || 'asset';
  const fileName = `${baseName}-${crypto.randomUUID()}${extension}`;
  const storageKey = `blog/${fileName}`;

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: storageKey,
      Body: input.buffer,
      ContentType: input.mimeType,
    })
  );

  return {
    storageKey,
    url: `/uploads/blog/${fileName}`,
    mimeType: input.mimeType,
    fileName: input.fileName || fileName,
    sizeBytes: input.buffer.byteLength,
    alt: input.alt,
  };
}

export async function storeUploadedFile(file: File, alt?: string) {
  const arrayBuffer = await file.arrayBuffer();

  return storeMediaFile({
    buffer: Buffer.from(arrayBuffer),
    mimeType: file.type || undefined,
    fileName: file.name || undefined,
    alt,
  });
}

export async function downloadRemoteMedia(url: string, alt?: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download media from ${url} (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const fileName = url.split('/').pop()?.split('?')[0] || 'remote-asset';

  return storeMediaFile({
    buffer,
    mimeType: response.headers.get('content-type') || undefined,
    fileName,
    alt,
  });
}
