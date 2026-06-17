import { PostSectionType, PostStatus } from '@prisma/client';
import type { BlogAdminPostSectionInput } from '@/lib/blog-admin-types';

type PublishValidationInput = {
  status: PostStatus;
  title: string;
  slug: string;
  excerpt?: string;
  heroSubtitle?: string;
  categoryIds: string[];
  featuredImageId?: string | null;
  hasFeaturedImageUpload?: boolean;
  sections: BlogAdminPostSectionInput[];
};

function hasMeaningfulHtmlContent(html: string) {
  const plainText = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText) {
    return true;
  }

  return /<(img|iframe|table|ul|ol|blockquote|figure|hr)\b/i.test(html);
}

function hasArticleBody(sections: BlogAdminPostSectionInput[]) {
  return sections.some((section) => section.type === PostSectionType.RICH_TEXT && hasMeaningfulHtmlContent(section.html || ''));
}

export function getPublishValidationErrors(input: PublishValidationInput) {
  if (input.status !== PostStatus.PUBLISHED) {
    return [];
  }

  const missing: string[] = [];

  if (!input.title.trim()) {
    missing.push('Título');
  }

  if (!input.slug.trim()) {
    missing.push('Slug');
  }

  if (!input.excerpt?.trim()) {
    missing.push('Excerpt');
  }

  if (!input.heroSubtitle?.trim()) {
    missing.push('Subtítulo del hero');
  }

  if (input.categoryIds.length === 0) {
    missing.push('Al menos una categoría');
  }

  if (!input.featuredImageId && !input.hasFeaturedImageUpload) {
    missing.push('Imagen destacada');
  }

  if (!hasArticleBody(input.sections)) {
    missing.push('Contenido del artículo');
  }

  return missing;
}
