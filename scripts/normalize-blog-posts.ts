import fs from 'node:fs/promises';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import { PostSectionType, Prisma } from '@prisma/client';
import { estimateReadingTimeFromHtml, renderPostSectionsHtml } from '../src/lib/blog-html';
import { getBlogPostsExportRecords } from '../src/lib/blog-export';
import { normalizeBlogRichTextHtml, summarizeNormalizationStats, type BlogNormalizationStats } from '../src/lib/blog-normalize';
import { getDb } from '../src/lib/db';

type CliOptions = {
  apply: boolean;
  slug?: string;
  limit?: number;
  backupPath?: string;
  verbose: boolean;
};

type PendingSectionUpdate = {
  id: string;
  position: number;
  beforeHtml: string;
  afterHtml: string;
  stats: BlogNormalizationStats;
};

type PendingPostUpdate = {
  id: string;
  slug: string;
  title: string;
  readingTimeMins: number;
  sectionUpdates: PendingSectionUpdate[];
};

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    apply: false,
    verbose: false
  };

  args.forEach((arg) => {
    if (arg === '--apply') {
      options.apply = true;
      return;
    }

    if (arg === '--verbose') {
      options.verbose = true;
      return;
    }

    if (arg.startsWith('--slug=')) {
      options.slug = arg.slice('--slug='.length).trim() || undefined;
      return;
    }

    if (arg.startsWith('--limit=')) {
      const value = Number.parseInt(arg.slice('--limit='.length), 10);
      options.limit = Number.isFinite(value) ? value : undefined;
      return;
    }

    if (arg.startsWith('--backup=')) {
      options.backupPath = arg.slice('--backup='.length).trim() || undefined;
    }
  });

  return options;
}

function getBackupPath(explicitPath?: string) {
  if (explicitPath) {
    return path.isAbsolute(explicitPath) ? explicitPath : path.join(process.cwd(), explicitPath);
  }

  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('');
  const time = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0')
  ].join('');

  return path.join(process.cwd(), `blog-posts-backup-${stamp}-${time}.json`);
}

function mergeStats(target: BlogNormalizationStats, source: BlogNormalizationStats) {
  Object.keys(target).forEach((key) => {
    const statKey = key as keyof BlogNormalizationStats;
    target[statKey] += source[statKey];
  });
}

async function writeBackup(outputPath: string) {
  const records = await getBlogPostsExportRecords();
  await fs.writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

async function main() {
  loadEnvConfig(process.cwd());

  const options = parseArgs(process.argv.slice(2));
  const db = getDb();
  const posts = await db.post.findMany({
    where: options.slug
      ? {
          slug: options.slug
        }
      : undefined,
    include: {
      sections: {
        orderBy: {
          position: 'asc'
        }
      }
    },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }]
  });

  const selectedPosts = typeof options.limit === 'number' ? posts.slice(0, options.limit) : posts;
  const totals: BlogNormalizationStats = {
    removedElementorArtifacts: 0,
    removedDuplicateTitles: 0,
    removedTableOfContents: 0,
    normalizedTables: 0,
    normalizedStepLists: 0,
    normalizedInternalLinks: 0,
    normalizedButtons: 0,
    normalizedInfoBoxes: 0,
    normalizedWarningBoxes: 0,
    unwrappedEmptyAnchors: 0,
    removedEmptyNodes: 0,
    removedRatingArtifacts: 0
  };
  const pendingUpdates: PendingPostUpdate[] = [];

  selectedPosts.forEach((post) => {
    const sectionUpdates: PendingSectionUpdate[] = [];
    const nextSections = post.sections.map((section) => ({
      ...section
    }));

    post.sections.forEach((section, index) => {
      if (section.type !== PostSectionType.RICH_TEXT) {
        return;
      }

      const result = normalizeBlogRichTextHtml(section.html || '', {
        postTitle: post.title
      });

      if (!result.changed) {
        return;
      }

      nextSections[index].html = result.html;
      sectionUpdates.push({
        id: section.id,
        position: section.position,
        beforeHtml: section.html || '',
        afterHtml: result.html,
        stats: result.stats
      });
      mergeStats(totals, result.stats);
    });

    if (sectionUpdates.length === 0) {
      return;
    }

    const renderedHtml = renderPostSectionsHtml(
      nextSections.map((section) => ({
        type: section.type,
        html: section.html
      }))
    );

    pendingUpdates.push({
      id: post.id,
      slug: post.slug,
      title: post.title,
      readingTimeMins: estimateReadingTimeFromHtml(renderedHtml),
      sectionUpdates
    });
  });

  console.log(`Posts revisados: ${selectedPosts.length}`);
  console.log(`Posts con cambios: ${pendingUpdates.length}`);

  pendingUpdates.forEach((post) => {
    const summary = post.sectionUpdates.map((section) => summarizeNormalizationStats(section.stats)).filter(Boolean).join(' | ');
    console.log(`- ${post.slug}: ${post.sectionUpdates.length} seccion(es)${summary ? ` -> ${summary}` : ''}`);

    if (options.verbose) {
      post.sectionUpdates.forEach((section) => {
        console.log(`  sección ${section.position}: ${section.beforeHtml.length} -> ${section.afterHtml.length}`);
      });
    }
  });

  const totalsSummary = summarizeNormalizationStats(totals);
  if (totalsSummary) {
    console.log(`Totales: ${totalsSummary}`);
  }

  if (!options.apply) {
    console.log('Modo dry-run. No se escribieron cambios en la base.');
    return;
  }

  if (pendingUpdates.length === 0) {
    console.log('No hay cambios para aplicar.');
    return;
  }

  const backupPath = getBackupPath(options.backupPath);
  await writeBackup(backupPath);
  console.log(`Backup exportado en ${backupPath}`);

  for (const post of pendingUpdates) {
    const operations: Prisma.PrismaPromise<unknown>[] = post.sectionUpdates.map((section) =>
      db.postSection.update({
        where: {
          id: section.id
        },
        data: {
          html: section.afterHtml
        }
      })
    );

    operations.push(
      db.post.update({
        where: {
          id: post.id
        },
        data: {
          readingTimeMins: post.readingTimeMins
        }
      })
    );

    await db.$transaction(operations);
  }

  console.log(`Normalización aplicada en ${pendingUpdates.length} posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
