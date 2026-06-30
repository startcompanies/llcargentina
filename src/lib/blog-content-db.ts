import { PostStatus, type Category, type MediaAsset, type Post, type PostSection } from '@prisma/client';
import { getDb } from '@/lib/db';

const sectionsQuery = {
  orderBy: { position: 'asc' as const },
};
import {
  buildFaqSchemaJson,
  escapeHtml,
  estimateReadingTimeFromHtml,
  extractFaqItems,
  extractFirstImageFromHtml,
  formatPublishedDate,
  mapCategoryIcon,
  renderPostSectionsHtml
} from '@/lib/blog-html';
import { getBlogPostPath, normalizeBlogHref } from '@/lib/blog-routes';
import { siteUrl } from '@/i18n/config';
import type {
  BlogArticle,
  BlogCategoryPageData,
  BlogCompactArticle,
  BlogFeaturedArticle,
  BlogIndexContent,
  BlogSidebarCategory,
  RelatedArticle
} from '@/lib/blog-content';

type DatabasePost = Post & {
  categories: Category[];
  sections: PostSection[];
  featuredImage: MediaAsset | null;
  openGraphImage: MediaAsset | null;
};

type PostWithImageSources = Pick<DatabasePost, 'title' | 'sections' | 'featuredImage' | 'openGraphImage'>;
type NavigationPost = Pick<Post, 'slug' | 'title' | 'publishedAt' | 'createdAt'>;
type PostCanonicalSource = Pick<Post, 'slug' | 'canonicalUrl'>;

function absoluteSiteUrl(path: string) {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function getPublicBlogPostPath(slug: string) {
  return `/noticias/${slug.replace(/^\/+|\/+$/g, '')}`;
}

function toPublicBlogPath(path: string) {
  if (path === '/blog') {
    return '/noticias';
  }

  if (path.startsWith('/blog/noticias/')) {
    return path.replace('/blog/noticias/', '/noticias/');
  }

  if (path.startsWith('/blog/categoria/')) {
    return path.replace('/blog/categoria/', '/noticias/categoria/');
  }

  if (path.startsWith('/blog/')) {
    return path.replace('/blog/', '/noticias/');
  }

  return path;
}

function postCanonicalUrl(post: PostCanonicalSource) {
  const fallback = absoluteSiteUrl(getPublicBlogPostPath(post.slug));
  const normalized = normalizeBlogHref(post.canonicalUrl ?? undefined);

  if (!normalized || normalized.startsWith('#') || normalized.startsWith('?')) {
    return fallback;
  }

  if (/^https?:\/\//i.test(normalized)) {
    try {
      const url = new URL(normalized);
      if (
        url.hostname === 'llcargentina.com' ||
        url.hostname === 'www.llcargentina.com' ||
        url.hostname === 'llcargentina.io' ||
        url.hostname === 'www.llcargentina.io' ||
        url.hostname === 'startcompanies.io' ||
        url.hostname === 'www.startcompanies.io'
      ) {
        return absoluteSiteUrl(`${toPublicBlogPath(url.pathname)}${url.search}${url.hash}`);
      }
    } catch {
      return fallback;
    }

    return fallback;
  }

  if (normalized.startsWith('/')) {
    return absoluteSiteUrl(toPublicBlogPath(normalized));
  }

  return fallback;
}

function absoluteImageUrl(value?: string) {
  if (!value) return undefined;
  return /^https?:\/\//i.test(value) ? value : absoluteSiteUrl(value);
}

function sortPublishedPosts<T extends NavigationPost>(posts: T[]) {
  return posts.toSorted((left, right) => {
    const leftDate = left.publishedAt ?? left.createdAt;
    const rightDate = right.publishedAt ?? right.createdAt;
    return rightDate.getTime() - leftDate.getTime();
  });
}

function sortFeaturedPosts(posts: DatabasePost[]) {
  return [...posts]
    .filter((post) => post.featuredRank !== null)
    .sort((left, right) => {
      const rankDiff = (left.featuredRank ?? Number.MAX_SAFE_INTEGER) - (right.featuredRank ?? Number.MAX_SAFE_INTEGER);

      if (rankDiff !== 0) {
        return rankDiff;
      }

      const leftDate = left.publishedAt ?? left.createdAt;
      const rightDate = right.publishedAt ?? right.createdAt;
      return rightDate.getTime() - leftDate.getTime();
    });
}

function categoryName(post: DatabasePost) {
  return post.categories[0]?.name ?? 'Blog';
}

function firstInlineImage(post: PostWithImageSources) {
  for (const section of post.sections) {
    if (section.type !== 'RICH_TEXT' || !section.html?.trim()) {
      continue;
    }

    const image = extractFirstImageFromHtml(section.html);

    if (image) {
      return image;
    }
  }

  return null;
}

function articleImage(post: PostWithImageSources) {
  return post.featuredImage?.url || post.openGraphImage?.url || firstInlineImage(post)?.src || '/img/blog-1.png';
}

function articleImageAlt(post: PostWithImageSources) {
  return post.featuredImage?.alt || post.openGraphImage?.alt || firstInlineImage(post)?.alt || post.title;
}

function articleShareImage(post: PostWithImageSources) {
  return post.openGraphImage?.url || post.featuredImage?.url || firstInlineImage(post)?.src || undefined;
}

function articleReadTime(post: DatabasePost) {
  const renderedHtml = renderPostSectionsHtml(post.sections);
  return post.readingTimeMins ?? estimateReadingTimeFromHtml(renderedHtml);
}

function toFeaturedArticle(post: DatabasePost): BlogFeaturedArticle {
  return {
    title: post.title,
    category: categoryName(post),
    imageSrc: articleImage(post),
    imageAlt: articleImageAlt(post),
    href: getBlogPostPath(post.slug),
    slug: post.slug,
    metaLabel: post.publishedAt ? `${formatPublishedDate(post.publishedAt)}` : 'Artículo',
    readTime: `${articleReadTime(post)} min`,
    excerpt: post.excerpt?.trim() || post.metaDescription?.trim() || post.heroSubtitle?.trim() || ''
  };
}

function toCompactArticle(post: DatabasePost): BlogCompactArticle {
  return {
    title: post.title,
    category: categoryName(post),
    imageSrc: articleImage(post),
    imageAlt: articleImageAlt(post),
    href: getBlogPostPath(post.slug),
    slug: post.slug,
    meta: `${post.publishedAt ? formatPublishedDate(post.publishedAt) : 'Artículo'} · ${articleReadTime(post)} min`
  };
}

function buildNavigation(posts: NavigationPost[], slug: string) {
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return [];
  }

  const previous = posts[currentIndex + 1];
  const next = posts[currentIndex - 1];

  return [
    previous
      ? {
          direction: 'previous' as const,
          href: getBlogPostPath(previous.slug),
          slug: previous.slug,
          title: previous.title
        }
      : null,
    next
      ? {
          direction: 'next' as const,
          href: getBlogPostPath(next.slug),
          slug: next.slug,
          title: next.title
        }
      : null
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function buildFaqJsonLd(post: DatabasePost): string | null {
  const faqSections = post.sections.filter((s) => s.type === 'FAQ_MODULE');
  const allItems = faqSections.flatMap((s) => extractFaqItems(s.html));
  if (!allItems.length) return null;
  return buildFaqSchemaJson(allItems);
}

function buildJsonLd(post: DatabasePost) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || post.excerpt || post.heroSubtitle || '',
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: absoluteImageUrl(articleShareImage(post)),
    mainEntityOfPage: postCanonicalUrl(post),
    author: {
      '@type': 'Organization',
      name: 'LLC Argentina'
    },
    publisher: {
      '@type': 'Organization',
      name: 'LLC Argentina',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/brand/llc-argentina-white-text.svg`
      }
    }
  });
}

export async function getAllBlogArticlesFromDatabase(): Promise<BlogArticle[]> {
  const db = getDb();
  const posts = sortPublishedPosts(
    await db.post.findMany({
      where: {
        status: PostStatus.PUBLISHED
      },
      include: {
        categories: {
          orderBy: {
            name: 'asc'
          }
        },
        sections: sectionsQuery,
        featuredImage: true,
        openGraphImage: true
      }
    })
  );

  return posts.map((post) => ({
    postId: post.id,
    slug: post.slug,
    title: post.title,
    description: post.metaDescription?.trim() || post.excerpt?.trim() || post.heroSubtitle?.trim() || post.title,
    keywords: post.keywords,
    badge: post.heroBadge?.trim() || categoryName(post),
    heroTitleHtml: post.heroTitleHtml?.trim() || escapeHtml(post.title),
    heroSubtitle: post.heroSubtitle?.trim() || post.excerpt?.trim() || '',
    metaItems: [
      categoryName(post),
      post.publishedAt ? formatPublishedDate(post.publishedAt) : 'Borrador',
    ],
    bodyHtml: renderPostSectionsHtml(post.sections),
    canonicalUrl: postCanonicalUrl(post),
    publishedTime: post.publishedAt?.toISOString(),
    ogImage: articleShareImage(post),
    metaTitle: post.metaTitle?.trim() || undefined,
    metaDescription: post.metaDescription?.trim() || undefined,
    jsonLd: [buildJsonLd(post), buildFaqJsonLd(post)].filter((v): v is string => Boolean(v)),
    navigation: buildNavigation(posts, post.slug),
    categoryIds: post.categories.map((c) => c.id),
    categorySlug: post.categories[0]?.slug
  }));
}

export async function getBlogArticleBySlugFromDatabase(slug: string) {
  const db = getDb();
  const post = await db.post.findFirst({
    where: {
      slug,
      status: PostStatus.PUBLISHED
    },
    include: {
      categories: {
        orderBy: {
          name: 'asc'
        }
      },
      sections: sectionsQuery,
      featuredImage: true,
      openGraphImage: true
    }
  });

  if (!post) {
    return null;
  }

  const publishedPosts = sortPublishedPosts(
    await db.post.findMany({
      where: {
        status: PostStatus.PUBLISHED
      },
      select: {
        slug: true,
        title: true,
        publishedAt: true,
        createdAt: true
      }
    })
  );

  return {
    postId: post.id,
    slug: post.slug,
    title: post.title,
    description: post.metaDescription?.trim() || post.excerpt?.trim() || post.heroSubtitle?.trim() || post.title,
    keywords: post.keywords,
    badge: post.heroBadge?.trim() || categoryName(post),
    heroTitleHtml: post.heroTitleHtml?.trim() || escapeHtml(post.title),
    heroSubtitle: post.heroSubtitle?.trim() || post.excerpt?.trim() || '',
    metaItems: [
      categoryName(post),
      post.publishedAt ? formatPublishedDate(post.publishedAt) : 'Borrador',
    ],
    bodyHtml: renderPostSectionsHtml(post.sections),
    canonicalUrl: postCanonicalUrl(post),
    publishedTime: post.publishedAt?.toISOString(),
    ogImage: articleShareImage(post),
    metaTitle: post.metaTitle?.trim() || undefined,
    metaDescription: post.metaDescription?.trim() || undefined,
    jsonLd: [buildJsonLd(post), buildFaqJsonLd(post)].filter((v): v is string => Boolean(v)),
    navigation: buildNavigation(publishedPosts, post.slug),
    categoryIds: post.categories.map((c) => c.id),
    categorySlug: post.categories[0]?.slug
  };
}

export async function getBlogIndexContentFromDatabase(): Promise<BlogIndexContent> {
  const db = getDb();
  const publishedPosts = sortPublishedPosts(
    await db.post.findMany({
      where: {
        status: PostStatus.PUBLISHED
      },
      include: {
        categories: {
          orderBy: {
            name: 'asc'
          }
        },
        sections: sectionsQuery,
        featuredImage: true,
        openGraphImage: true
      }
    })
  );

  const featuredPosts = sortFeaturedPosts(publishedPosts).slice(0, 3);
  const featuredPostIds = new Set(featuredPosts.map((post) => post.id));
  const morePosts = publishedPosts.filter((post) => !featuredPostIds.has(post.id));

  const categories = await db.category.findMany({
    where: {
      posts: {
        some: {
          status: PostStatus.PUBLISHED
        }
      }
    },
    include: {
      cardImage: true,
      posts: {
        where: {
          status: PostStatus.PUBLISHED
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: 3,
        include: {
          featuredImage: true,
          openGraphImage: true,
          sections: sectionsQuery
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  const sidebarCategories: BlogSidebarCategory[] = categories.slice(0, 5).map((category) => ({
    label: category.name,
    href: `/blog/categoria/${category.slug}`,
    icon: mapCategoryIcon(category.icon)
  }));

  return {
    featuredArticles: featuredPosts.map(toFeaturedArticle),
    moreArticles: morePosts.map(toCompactArticle),
    sidebarCategories,
    categoryCards: categories.slice(0, 4).map((category) => ({
      title: category.name,
      anchorId: `category-${category.slug}`,
      categoryHref: `/blog/categoria/${category.slug}`,
      imageSrc: category.cardImage?.url || (category.posts[0] ? articleImage(category.posts[0]) : '/img/blog-1.png'),
      imageAlt: category.cardImage?.alt || category.name,
      links: category.posts.map((post) => ({
        label: post.title,
        href: getBlogPostPath(post.slug)
      }))
    }))
  };
}

export async function getBlogCategoryContentFromDatabase(slug: string): Promise<BlogCategoryPageData | null> {
  const db = getDb();

  const [category, allCategories] = await Promise.all([
    db.category.findFirst({
      where: { slug },
      include: {
        posts: {
          where: { status: PostStatus.PUBLISHED },
          include: {
            categories: { orderBy: { name: 'asc' } },
            sections: sectionsQuery,
            featuredImage: true,
            openGraphImage: true
          },
          orderBy: { publishedAt: 'desc' }
        }
      }
    }),
    db.category.findMany({
      where: { posts: { some: { status: PostStatus.PUBLISHED } } },
      orderBy: { name: 'asc' }
    })
  ]);

  if (!category) return null;

  const publishedPosts = sortPublishedPosts(category.posts);

  const sidebarCategories: BlogSidebarCategory[] = allCategories.slice(0, 5).map((cat) => ({
    label: cat.name,
    href: `/blog/categoria/${cat.slug}`,
    icon: mapCategoryIcon(cat.icon)
  }));

  return {
    categoryName: category.name,
    categorySlug: category.slug,
    description: category.description ?? undefined,
    content: {
      featuredArticles: [],
      moreArticles: publishedPosts.map(toCompactArticle),
      sidebarCategories,
      categoryCards: []
    }
  };
}

export async function getPublishedCategorySlugsFromDatabase(): Promise<string[]> {
  const db = getDb();
  const categories = await db.category.findMany({
    where: { posts: { some: { status: PostStatus.PUBLISHED } } },
    select: { slug: true },
    orderBy: { name: 'asc' }
  });
  return categories.map((c) => c.slug);
}

export async function getRelatedArticlesFromDatabase(
  postId: string,
  categoryIds: string[],
  limit: number = 3
): Promise<RelatedArticle[]> {
  const db = getDb();

  const relatedPosts = await db.post.findMany({
    where: {
      id: { not: postId },
      status: PostStatus.PUBLISHED,
      categories: {
        some: {
          id: { in: categoryIds }
        }
      }
    },
    include: {
      categories: {
        orderBy: { name: 'asc' }
      },
      sections: sectionsQuery,
      featuredImage: true,
      openGraphImage: true
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: limit
  });

  return relatedPosts.map((post) => ({
    title: post.title,
    slug: post.slug,
    imageSrc: articleImage(post),
    category: post.categories[0]?.name ?? 'Blog',
    excerpt: post.excerpt?.trim() || post.metaDescription?.trim() || post.heroSubtitle?.trim() || ''
  }));
}
