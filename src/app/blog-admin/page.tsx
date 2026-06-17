import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog Admin',
  robots: {
    index: false,
    follow: true
  }
};

export default function BlogAdminEntryPage() {
  redirect('/blog-admin/login');
}
