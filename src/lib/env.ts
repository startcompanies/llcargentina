import path from 'node:path';

const DEFAULT_STORAGE_DIR = 'public/uploads/blog';
const DEFAULT_STORAGE_PUBLIC_BASE_PATH = '/uploads/blog';

export function getBlogStorageDir() {
  const configuredDir = process.env.BLOG_STORAGE_DIR?.trim() || DEFAULT_STORAGE_DIR;

  if (path.isAbsolute(configuredDir)) {
    return configuredDir;
  }

  return path.join(/* turbopackIgnore: true */ process.cwd(), configuredDir.replace(/^\/+/, ''));
}

export function getBlogStoragePublicBasePath() {
  const configuredBasePath = process.env.BLOG_STORAGE_PUBLIC_BASE_PATH?.trim() || DEFAULT_STORAGE_PUBLIC_BASE_PATH;
  const normalized = configuredBasePath.startsWith('/') ? configuredBasePath : `/${configuredBasePath}`;
  return normalized.replace(/\/{2,}/g, '/').replace(/\/$/, '');
}
