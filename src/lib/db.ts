import { PrismaClient } from '@prisma/client';
import { isDatabaseConfigured } from '@/lib/app-config';

declare global {
  var __llcArgentinaPrisma__: PrismaClient | undefined;
}

export function getDb() {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_URL is not configured.');
  }

  if (!global.__llcArgentinaPrisma__) {
    global.__llcArgentinaPrisma__ = new PrismaClient();
  }

  return global.__llcArgentinaPrisma__;
}
