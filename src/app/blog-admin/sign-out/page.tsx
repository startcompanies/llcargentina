import type { Metadata } from 'next';
import { SignOutClient } from './SignOutClient';

export const metadata: Metadata = {
  title: 'Cerrar sesión',
  robots: {
    index: false,
    follow: true
  }
};

export default function BlogAdminSignOutPage() {
  return <SignOutClient />;
}
