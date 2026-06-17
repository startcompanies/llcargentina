import { hash } from 'bcryptjs';
import { loadEnvConfig } from '@next/env';
import { getSeedAdminCredentials } from '../src/lib/app-config';
import { getDb } from '../src/lib/db';

async function main() {
  loadEnvConfig(process.cwd());

  const { email, password } = getSeedAdminCredentials();

  if (!email || !password) {
    throw new Error('BLOG_ADMIN_EMAIL y BLOG_ADMIN_PASSWORD son obligatorios para crear el admin inicial.');
  }

  const db = getDb();
  const passwordHash = await hash(password, 12);
  const user = await db.adminUser.upsert({
    where: {
      email: email.toLowerCase()
    },
    update: {
      passwordHash
    },
    create: {
      email: email.toLowerCase(),
      name: 'Blog Admin',
      passwordHash
    }
  });

  console.log(`Admin listo: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const db = getDb();
    await db.$disconnect();
  });
