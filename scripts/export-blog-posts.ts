import fs from 'node:fs/promises';
import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import { getDb } from '../src/lib/db';
import { getBlogPostsExportRecords } from '../src/lib/blog-export';

async function main() {
  loadEnvConfig(process.cwd());

  const outputArg = process.argv[2];
  const outputPath = path.isAbsolute(outputArg || '')
    ? (outputArg as string)
    : path.join(process.cwd(), outputArg || 'blog-posts-export.json');

  const records = await getBlogPostsExportRecords();
  await fs.writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, 'utf8');

  console.log(`Exportados ${records.length} posts en ${outputPath}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
