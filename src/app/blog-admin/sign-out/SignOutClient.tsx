'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export function SignOutClient() {
  useEffect(() => {
    void signOut({ callbackUrl: '/blog-admin/login' });
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Cerrando sesión…</p>
    </div>
  );
}
