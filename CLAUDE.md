# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint

# Database
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Push schema changes to the database

# Blog admin / data
npm run db:seed-admin          # Seed the blog admin user
npm run export:blog-json       # Export blog posts as JSON
npm run normalize:blog-posts   # Normalize post content
```

There is no test suite.

## Architecture

**Framework:** Next.js App Router (React 19). Path alias `@/*` maps to `src/*`.

**Scope:** This repo intentionally ships only the public home, public blog, and blog admin. Removed routes should stay removed unless the product scope changes.

**Styling:** Plain CSS, no Tailwind. Global styles live in `src/app/globals.css`; components use local `.module.css` files.

**Font:** Poppins, configured in `src/lib/fonts.ts` as `inter` for historical compatibility. Both `inter.variable` and `inter.className` are applied to `<body>` in `layout.tsx`.

**Database:** PostgreSQL via Prisma 6. Schema at `prisma/schema.prisma`. The Prisma client singleton lives at `src/lib/db.ts`. After schema changes, run `npm run db:generate`.

**Authentication:** NextAuth v4 with a credentials provider and JWT sessions. Config lives at `src/lib/auth.ts`. Protected routes live under `/blog-admin/*`.

**Blog system:** Public routes are `/blog`, `/blog/[slug]`, and `/blog/categoria/[slug]`.
- `src/lib/blog-admin-service.ts` — CRUD for posts, categories, media
- `src/lib/blog-content.ts` — data loading for public blog pages
- `src/lib/media-storage.ts` — file upload/serving from `BLOG_STORAGE_DIR`
- `src/app/blog-admin/actions.ts` — server actions wired to admin UI forms
- `src/app/uploads/blog/[...path]/route.ts` — serves uploaded media

Blog posts are composed of `PostSection` blocks (`RICH_TEXT`, `CTA_CONSULTATION`, `CTA_PRICING`) and use Tiptap as the rich-text editor.

## Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

BLOG_ADMIN_EMAIL=...
BLOG_ADMIN_PASSWORD=...

BLOG_STORAGE_DIR=/absolute/path/to/media
BLOG_STORAGE_PUBLIC_BASE_PATH=/uploads/blog
```
