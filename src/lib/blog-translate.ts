import type { BlogArticle, BlogIndexContent } from '@/lib/blog-content';

const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';

async function translateChunk(text: string, from: string, to: string): Promise<string> {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: from,
    tl: to,
    dt: 't',
    q: text
  });

  const response = await fetch(`${TRANSLATE_URL}?${params}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  if (!response.ok) {
    throw new Error(`Translation request failed: ${response.status}`);
  }

  const data = await response.json();

  // Response format: [[["translated","original",null,null,10],...],null,"es"]
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error('Unexpected translation response format');
  }

  return data[0]
    .filter((segment: unknown) => Array.isArray(segment) && segment[0])
    .map((segment: unknown[]) => segment[0])
    .join('');
}

/**
 * Splits HTML at block-tag boundaries into chunks under maxLen chars.
 */
function splitHtml(html: string, maxLen = 4500): string[] {
  if (html.length <= maxLen) return [html];

  const chunks: string[] = [];
  let remaining = html;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    const slice = remaining.slice(0, maxLen);
    const blockTagPattern = /<\/(p|div|h[1-6]|ul|ol|li|blockquote|section|figure|table|tr)>/gi;
    let lastSplit = -1;
    let match;

    while ((match = blockTagPattern.exec(slice)) !== null) {
      lastSplit = match.index + match[0].length;
    }

    if (lastSplit === -1) lastSplit = maxLen;

    chunks.push(remaining.slice(0, lastSplit));
    remaining = remaining.slice(lastSplit);
  }

  return chunks;
}

export async function translateSingleText(text: string, targetLocale: string): Promise<string> {
  try {
    return await translateChunk(text, 'es', targetLocale);
  } catch {
    return text;
  }
}

export async function getTranslatedBodyHtml(
  _postId: string,
  bodyHtml: string,
  targetLocale: string
): Promise<string | null> {
  try {
    const chunks = splitHtml(bodyHtml);
    const results: string[] = [];

    for (const chunk of chunks) {
      const translated = await translateChunk(chunk, 'es', targetLocale);
      results.push(translated);
    }

    return results.join('');
  } catch (error) {
    console.warn('Translation failed:', error);
    return null;
  }
}

/**
 * Translate a batch of short strings in a single request by joining them
 * with a separator that Google Translate preserves, then splitting back.
 */
const BATCH_SEP = ' ||| ';

async function translateTexts(
  texts: string[],
  targetLocale: string
): Promise<string[]> {
  if (texts.length === 0) return [];

  const joined = texts.join(BATCH_SEP);
  const translated = await translateChunk(joined, 'es', targetLocale);
  const parts = translated.split(/\s*\|\|\|\s*/);

  if (parts.length === texts.length) return parts;

  // Fallback: translate one by one
  const results: string[] = [];
  for (const text of texts) {
    results.push(await translateChunk(text, 'es', targetLocale));
  }
  return results;
}

/**
 * Translate the blog index content (card titles, excerpts, categories, etc.)
 */
export async function translateBlogIndexContent(
  content: BlogIndexContent,
  targetLocale: string
): Promise<BlogIndexContent> {
  try {
    // Collect all translatable strings in one batch
    const texts: string[] = [];

    for (const a of content.featuredArticles) {
      texts.push(a.title, a.category, a.excerpt);
    }
    for (const a of content.moreArticles) {
      texts.push(a.title, a.category);
    }
    for (const c of content.sidebarCategories) {
      texts.push(c.label);
    }
    for (const c of content.categoryCards) {
      texts.push(c.title);
      for (const link of c.links) {
        texts.push(link.label);
      }
    }

    const translated = await translateTexts(texts, targetLocale);
    let i = 0;

    const featuredArticles = content.featuredArticles.map((a) => ({
      ...a,
      title: translated[i++],
      category: translated[i++],
      excerpt: translated[i++]
    }));

    const moreArticles = content.moreArticles.map((a) => ({
      ...a,
      title: translated[i++],
      category: translated[i++]
    }));

    const sidebarCategories = content.sidebarCategories.map((c) => ({
      ...c,
      label: translated[i++]
    }));

    const categoryCards = content.categoryCards.map((c) => ({
      ...c,
      title: translated[i++],
      links: c.links.map((link) => ({
        ...link,
        label: translated[i++]
      }))
    }));

    return { featuredArticles, moreArticles, sidebarCategories, categoryCards };
  } catch (error) {
    console.warn('Blog index translation failed:', error);
    return content;
  }
}

/**
 * Translate the article hero fields (badge, title, subtitle, meta items)
 */
export async function translateArticleHero(
  article: BlogArticle,
  targetLocale: string
): Promise<BlogArticle> {
  try {
    const texts = [
      article.badge,
      article.heroTitleHtml,
      article.heroSubtitle,
      ...article.metaItems,
      ...article.navigation.map((n) => n.title)
    ];

    const translated = await translateTexts(texts, targetLocale);
    let i = 0;

    return {
      ...article,
      badge: translated[i++],
      heroTitleHtml: translated[i++],
      heroSubtitle: translated[i++],
      metaItems: article.metaItems.map(() => translated[i++]),
      navigation: article.navigation.map((n) => ({
        ...n,
        title: translated[i++]
      }))
    };
  } catch (error) {
    console.warn('Article hero translation failed:', error);
    return article;
  }
}
