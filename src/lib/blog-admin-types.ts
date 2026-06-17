import type { CategoryIcon, PostSectionType, PostStatus } from '@prisma/client';

export type BlogAdminAssetOption = {
  id: string;
  label: string;
  url: string;
  alt: string;
};

export type BlogAdminCategoryOption = {
  id: string;
  name: string;
  slug: string;
  icon: CategoryIcon;
};

export type BlogAdminPostSummary = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  publishedAt: string | null;
  updatedAt: string;
  featuredRank: number | null;
  excerpt: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  categories: string[];
};

export type BlogAdminPostSectionInput = {
  type: PostSectionType;
  html: string;
};

export type BlogAdminPostEditorData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  status: PostStatus;
  featuredRank: string;
  heroBadge: string;
  heroTitleHtml: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
  publishedAt: string;
  categoryIds: string[];
  featuredImageId: string;
  openGraphImageId: string;
  sections: BlogAdminPostSectionInput[];
};

export type BlogAdminCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: CategoryIcon;
  cardImageId: string;
  cardImageUrl?: string;
};
