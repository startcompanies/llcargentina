import { isDatabaseConfigured } from '@/lib/app-config';
import { getAllBlogArticlesFromDatabase, getBlogArticleBySlugFromDatabase, getBlogCategoryContentFromDatabase, getBlogIndexContentFromDatabase } from '@/lib/blog-content-db';

type BlogCardBase = {
  title: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
  slug?: string;
};

export type BlogFeaturedArticle = BlogCardBase & {
  metaLabel: string;
  readTime: string;
  excerpt: string;
};

export type BlogCompactArticle = BlogCardBase & {
  meta: string;
};

export type BlogCategoryLink = {
  label: string;
  href?: string;
};

export type BlogCategoryCardData = {
  title: string;
  anchorId?: string;
  categoryHref?: string;
  imageSrc: string;
  imageAlt: string;
  links: BlogCategoryLink[];
};

export type BlogCategoryPageData = {
  categoryName: string;
  categorySlug: string;
  description?: string;
  content: BlogIndexContent;
};

export type BlogSidebarCategory = {
  label: string;
  href: string;
  icon: 'building' | 'receipt' | 'bank' | 'document' | 'globe';
};

export type BlogIndexContent = {
  featuredArticles: BlogFeaturedArticle[];
  moreArticles: BlogCompactArticle[];
  sidebarCategories: BlogSidebarCategory[];
  categoryCards: BlogCategoryCardData[];
};

export type BlogArticleNavigationLink = {
  direction: 'previous' | 'next';
  href: string;
  slug: string;
  title: string;
};

export type BlogArticle = {
  postId: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  badge: string;
  heroTitleHtml: string;
  heroSubtitle: string;
  metaItems: string[];
  bodyHtml: string;
  canonicalUrl?: string;
  publishedTime?: string;
  ogImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  jsonLd: string[];
  navigation: BlogArticleNavigationLink[];
  categoryIds?: string[];
  categorySlug?: string;
};

export type RelatedArticle = {
  title: string;
  slug: string;
  imageSrc: string;
  category: string;
  excerpt: string;
};

const EMPTY_INDEX: BlogIndexContent = {
  featuredArticles: [],
  moreArticles: [],
  sidebarCategories: [],
  categoryCards: []
};

export async function getBlogIndexContent(): Promise<BlogIndexContent> {
  if (!isDatabaseConfigured()) {
    return EMPTY_INDEX;
  }

  try {
    return await getBlogIndexContentFromDatabase();
  } catch (error) {
    console.warn('Failed to load blog index content from database.', error);
    return EMPTY_INDEX;
  }
}

export async function getAllBlogArticles(): Promise<BlogArticle[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await getAllBlogArticlesFromDatabase();
  } catch (error) {
    console.warn('Failed to load blog articles from database.', error);
    return [];
  }
}

export async function getBlogArticleBySlug(slug: string): Promise<BlogArticle | undefined> {
  if (!isDatabaseConfigured()) {
    return undefined;
  }

  try {
    const article = await getBlogArticleBySlugFromDatabase(slug);
    return article ?? undefined;
  } catch (error) {
    console.warn(`Failed to load blog article "${slug}" from database.`, error);
    return undefined;
  }
}

export async function getBlogCategoryContent(slug: string): Promise<BlogCategoryPageData | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    return await getBlogCategoryContentFromDatabase(slug);
  } catch (error) {
    console.warn(`Failed to load blog category "${slug}" from database.`, error);
    return null;
  }
}

export async function getRelatedArticles(postId: string, categoryIds: string[], limit: number = 3): Promise<RelatedArticle[]> {
  if (!isDatabaseConfigured() || categoryIds.length === 0) {
    return [];
  }

  try {
    const { getRelatedArticlesFromDatabase } = await import('@/lib/blog-content-db');
    return await getRelatedArticlesFromDatabase(postId, categoryIds, limit);
  } catch (error) {
    console.warn('Failed to load related articles from database.', error);
    return [];
  }
}
