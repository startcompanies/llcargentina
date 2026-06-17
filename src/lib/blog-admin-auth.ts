import { redirect } from 'next/navigation';
import { getAdminSession, isAuthenticatedSession } from '@/lib/auth';

export async function requireBlogAdminSession() {
  const session = await getAdminSession();

  if (!isAuthenticatedSession(session)) {
    redirect('/blog-admin/login');
  }

  return session;
}
