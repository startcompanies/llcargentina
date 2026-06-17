import type { Metadata } from 'next';
import { LoginForm } from '@/components/blog-admin/LoginForm/LoginForm';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog Admin Login'
};

export default function BlogAdminLoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.eyebrow}>Blog Admin</div>
        <h1 className={styles.title}>Acceso editorial</h1>
        <p className={styles.description}>
          Panel custom para crear, editar, publicar y migrar los artículos del blog sin depender de WordPress.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
