'use client';

import { PostStatus } from '@prisma/client';
import Image, { type ImageLoaderProps } from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useMemo, useRef, useState } from 'react';
import { updatePostStatusAction } from '@/app/blog-admin/actions';
import type { BlogAdminPostSummary } from '@/lib/blog-admin-types';
import { getBlogPostPath } from '@/lib/blog-routes';
import styles from './BlogPostsDashboard.module.css';

type BlogPostsDashboardProps = {
  posts: BlogAdminPostSummary[];
};

type StatusFilter = 'ALL' | PostStatus;

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'ALL', label: 'Todos' },
  { value: PostStatus.PUBLISHED, label: 'Publicados' },
  { value: PostStatus.DRAFT, label: 'Borradores' },
  { value: PostStatus.ARCHIVED, label: 'Archivados' }
];

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short'
});

function statusLabel(status: PostStatus) {
  switch (status) {
    case PostStatus.PUBLISHED:
      return 'Publicado';
    case PostStatus.ARCHIVED:
      return 'Archivado';
    case PostStatus.DRAFT:
    default:
      return 'Borrador';
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Sin fecha';
  }

  return LONG_DATE_FORMATTER.format(new Date(value));
}

function formatShortDate(value: string) {
  return SHORT_DATE_FORMATTER.format(new Date(value));
}

function thumbnailLoader({ src }: ImageLoaderProps) {
  return src;
}

export function BlogPostsDashboard({ posts }: BlogPostsDashboardProps) {
  const router = useRouter();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const metrics = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((post) => post.status === PostStatus.PUBLISHED).length,
      draft: posts.filter((post) => post.status === PostStatus.DRAFT).length,
      archived: posts.filter((post) => post.status === PostStatus.ARCHIVED).length,
      featured: posts.filter((post) => post.featuredRank !== null).length
    }),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return posts.filter((post) => {
      if (statusFilter !== 'ALL' && post.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        post.title,
        post.slug,
        post.excerpt,
        post.categories.join(' ')
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [deferredQuery, posts, statusFilter]);

  async function handleImportFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsImporting(true);
    setImportStatus(null);

    const formData = new FormData();
    formData.set('file', file);

    try {
      const response = await fetch('/api/blog-admin/posts/import', {
        method: 'POST',
        body: formData
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'No pudimos importar el archivo.');
      }

      const details = payload.skipped
        ? ` ${payload.skipped} salteado${payload.skipped === 1 ? '' : 's'}.`
        : '';
      setImportStatus(`Importados: ${payload.created} nuevos, ${payload.updated} actualizados.${details}`);
      router.refresh();
    } catch (error) {
      setImportStatus(error instanceof Error ? error.message : 'No pudimos importar el archivo.');
    } finally {
      setIsImporting(false);

      if (importInputRef.current) {
        importInputRef.current.value = '';
      }
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.kicker}>Contenido</div>
          <h2 className={styles.title}>Blog</h2>
          <p className={styles.description}>Buscá, filtrá y ordená el inventario editorial sin salir del dashboard.</p>
        </div>

        <div className={styles.topbarActions}>
          <input
            ref={importInputRef}
            className={styles.importInput}
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              void handleImportFile(event.target.files?.[0]);
            }}
          />
          <button
            type="button"
            className={styles.importButton}
            disabled={isImporting}
            onClick={() => importInputRef.current?.click()}
          >
            {isImporting ? 'Importando...' : 'Importar JSON'}
          </button>
          <Link href="/api/blog-admin/posts/export" className={styles.exportButton} prefetch={false}>
            Exportar JSON
          </Link>
          <Link href="/blog-admin/posts/new" className={styles.createButton}>
            Nuevo post
          </Link>
        </div>
      </div>

      {importStatus ? <div className={styles.importStatus}>{importStatus}</div> : null}

      <div className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Inventario</span>
          <strong className={styles.metricValue}>{metrics.total}</strong>
          <span className={styles.metricHint}>Blog creadas</span>
        </article>

        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Live</span>
          <strong className={styles.metricValue}>{metrics.published}</strong>
          <span className={styles.metricHint}>Publicados</span>
        </article>

        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Edición</span>
          <strong className={styles.metricValue}>{metrics.draft}</strong>
          <span className={styles.metricHint}>En borrador</span>
        </article>

        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Visibilidad</span>
          <strong className={styles.metricValue}>{metrics.featured}</strong>
          <span className={styles.metricHint}>Con featured rank</span>
        </article>
      </div>

      <section className={styles.filtersPanel}>
        <div className={styles.searchField}>
          <label htmlFor="posts-search" className={styles.searchLabel}>
            Buscar posts
          </label>
          <input
            id="posts-search"
            className={styles.searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Título, slug o categoría"
          />
        </div>

        <div className={styles.filterGroup}>
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={statusFilter === filter.value ? `${styles.filterChip} ${styles.filterChipActive}` : styles.filterChip}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.resultMeta}>
          {filteredPosts.length} resultado{filteredPosts.length === 1 ? '' : 's'}
        </div>
      </section>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          No hay posts todavía. Creá el primero o importá el lote histórico desde WordPress.
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className={styles.empty}>No encontramos posts para ese filtro. Probá con otro término o estado.</div>
      ) : (
        <div className={styles.postsGrid}>
          {filteredPosts.map((post) => (
            <article key={post.id} className={styles.postCard}>
              <div className={styles.postMedia}>
                <Image
                  src={post.thumbnailUrl}
                  alt={post.thumbnailAlt}
                  loader={thumbnailLoader}
                  unoptimized
                  fill
                  sizes="(max-width: 820px) 100vw, 168px"
                  className={styles.postImage}
                />
              </div>

              <div className={styles.postBody}>
                <div className={styles.postHeader}>
                  <div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <div className={styles.postSlug}>{getBlogPostPath(post.slug)}</div>
                  </div>

                  <span
                    className={
                      post.status === PostStatus.PUBLISHED
                        ? `${styles.statusBadge} ${styles.statusPublished}`
                        : post.status === PostStatus.ARCHIVED
                          ? `${styles.statusBadge} ${styles.statusArchived}`
                          : `${styles.statusBadge} ${styles.statusDraft}`
                    }
                  >
                    {statusLabel(post.status)}
                  </span>
                </div>

                <p className={styles.postExcerpt}>
                  {post.excerpt || 'Este artículo todavía no tiene resumen editorial cargado.'}
                </p>

                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>Publicación: {formatDate(post.publishedAt)}</span>
                  <span className={styles.metaItem}>Editado: {formatShortDate(post.updatedAt)}</span>
                  {post.featuredRank !== null ? <span className={styles.rankChip}>Featured #{post.featuredRank}</span> : null}
                </div>

                <div className={styles.categoryRow}>
                  {post.categories.length ? (
                    post.categories.map((category) => (
                      <span key={`${post.id}-${category}`} className={styles.categoryChip}>
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className={styles.categoryChipMuted}>Sin categoría</span>
                  )}
                </div>

                <div className={styles.actions}>
                  <Link href={`/blog-admin/posts/${post.id}`} className={styles.primaryAction}>
                    Editar
                  </Link>
                  <Link href={`/blog-admin/posts/${post.id}/preview`} className={styles.secondaryAction}>
                    Preview
                  </Link>
                  {post.status === PostStatus.PUBLISHED ? (
                    <Link href={getBlogPostPath(post.slug)} className={styles.secondaryAction}>
                      Ver live
                    </Link>
                  ) : null}
                  {post.status !== PostStatus.ARCHIVED ? (
                    <form action={updatePostStatusAction}>
                      <input type="hidden" name="postId" value={post.id} />
                      <input type="hidden" name="slug" value={post.slug} />
                      <input type="hidden" name="redirectTo" value="/blog-admin/posts" />
                      <button type="submit" className={styles.archiveButton}>
                        Archivar
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
