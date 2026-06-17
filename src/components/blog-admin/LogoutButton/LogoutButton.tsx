'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { signOut } from 'next-auth/react';
import styles from './LogoutButton.module.css';

export function LogoutButton() {
  const { refresh, replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={styles.button}
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          void signOut({
            redirect: false,
            callbackUrl: '/blog-admin/login'
          }).finally(() => {
            replace('/blog-admin/login');
            refresh();
          });
        });
      }}
    >
      {isPending ? 'Cerrando...' : 'Cerrar sesión'}
    </button>
  );
}
