import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogoutButton } from '@/components/blog-admin/LogoutButton/LogoutButton';
import styles from './AdminShell.module.css';

type AdminShellProps = {
  currentPath: string;
  title: string;
  description: string;
  children: ReactNode;
  notice?: {
    tone?: 'success' | 'error';
    message: string;
  };
};

const NAV_ITEMS = [
  { href: '/blog-admin/posts', label: 'Posts' },
  { href: '/blog-admin/categories', label: 'Categorías' },
  { href: '/blog', label: 'Ver blog' }
];

function isActivePath(currentPath: string, href: string) {
  if (href === '/blog') {
    return false;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AdminShell({ currentPath, title, description, children, notice }: AdminShellProps) {
  return (
    <div className={styles.page}>
      <div className={styles.backdrop} />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <div className={styles.eyebrow}>Blog Admin</div>
            <div className={styles.brand}>LLC Argentina</div>
          </div>

          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActivePath(currentPath, item.href) ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <LogoutButton />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.heroBody}>
            <div className={styles.eyebrow}>Panel editorial</div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
          </div>
        </section>

        {notice ? (
          <div className={notice.tone === 'error' ? `${styles.notice} ${styles.noticeError}` : `${styles.notice} ${styles.noticeSuccess}`}>
            {notice.message}
          </div>
        ) : null}

        <section className={styles.content}>{children}</section>
      </main>
    </div>
  );
}
