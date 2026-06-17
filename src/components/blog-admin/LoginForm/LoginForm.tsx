'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { refresh, replace } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setLocalError('');

        startTransition(() => {
          void signIn('credentials', {
            email,
            password,
            redirect: false,
            callbackUrl: '/blog-admin/posts'
          })
            .then((result) => {
              if (!result?.ok) {
                setLocalError('No pudimos iniciar sesión. Revisá el email y la contraseña.');
                return;
              }

              replace('/blog-admin/posts');
              refresh();
            })
            .catch(() => {
              setLocalError('Error inesperado en el login.');
            });
        });
      }}
    >
      <label className={styles.field}>
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@llcargentina.io"
          required
        />
      </label>

      <label className={styles.field}>
        <span>Contraseña</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••••"
          required
        />
      </label>

      {localError ? <div className={styles.error}>{localError}</div> : null}

      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? 'Ingresando...' : 'Entrar al panel'}
      </button>
    </form>
  );
}
