export type PostSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

export type Post = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: 'Primeros pasos' | 'Operaciones' | 'Cumplimiento' | 'Ventas globales';
  date: string;
  updated: string;
  readTime: string;
  accent: 'lime' | 'coral' | 'gold' | 'sand';
  sections: PostSection[];
};

/**
 * Posts are managed from the Start Companies panel (/blog-admin/satelites) and
 * fetched at build time. Publishing a post there triggers this site's Vercel
 * deploy hook, so pages stay fully static.
 *
 * If the API is unreachable or returns nothing, the build fails on purpose and
 * Vercel keeps the last good deployment online: the site never loses its posts.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   SATELLITES_API_URL   = https://www.startcompanies.net/api/satellites/<site>/posts
 *   SATELLITES_API_TOKEN = read-only token
 */
async function loadPosts(): Promise<Post[]> {
  const url = process.env.SATELLITES_API_URL ?? import.meta.env.SATELLITES_API_URL;
  const token = process.env.SATELLITES_API_TOKEN ?? import.meta.env.SATELLITES_API_TOKEN;
  if (!url || !token) {
    throw new Error('Faltan SATELLITES_API_URL / SATELLITES_API_TOKEN: no se pueden cargar los posts.');
  }

  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    throw new Error(`La API de posts respondió ${response.status} (${url}).`);
  }

  const data = (await response.json()) as { posts?: Post[] };
  if (!Array.isArray(data.posts) || data.posts.length === 0) {
    throw new Error('La API de posts no devolvió posts.');
  }

  return data.posts;
}

export const posts: Post[] = await loadPosts();

export const categories = ['Todas', ...new Set(posts.map((post) => post.category))] as const;
export const findPost = (slug: string) => posts.find((post) => post.slug === slug);
