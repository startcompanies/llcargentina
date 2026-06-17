export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function isBlogAdminConfigured() {
  return isDatabaseConfigured() && Boolean(process.env.NEXTAUTH_SECRET?.trim());
}

export function getAppUrl() {
  return process.env.NEXTAUTH_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
}

export function getSeedAdminCredentials() {
  return {
    email: process.env.BLOG_ADMIN_EMAIL?.trim() || '',
    password: process.env.BLOG_ADMIN_PASSWORD?.trim() || ''
  };
}
