import { compare, hash } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getAuthSecret, getSeedAdminCredentials, isBlogAdminConfigured } from '@/lib/app-config';
import { getDb } from '@/lib/db';

function logAuthWarning(message: string, metadata?: Record<string, string | boolean>) {
  console.warn('[blog-admin-auth]', message, metadata ?? {});
}

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  useSecureCookies: false,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/blog-admin/login'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          logAuthWarning('missing_credentials');
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const seedCredentials = getSeedAdminCredentials();
        const seedEmail = seedCredentials.email.toLowerCase().trim();
        const hasSeedCredentials = Boolean(seedEmail && seedCredentials.password);
        const matchesSeedCredentials = Boolean(
          hasSeedCredentials &&
            email === seedEmail &&
            credentials.password === seedCredentials.password
        );

        if (!isBlogAdminConfigured()) {
          if (matchesSeedCredentials) {
            logAuthWarning('database_not_configured_using_env_admin', { email });
            return {
              id: 'env-blog-admin',
              email,
              name: 'Blog Admin'
            };
          }

          logAuthWarning('database_not_configured');
          return null;
        }

        const db = getDb();
        let user;

        try {
          user = await db.adminUser.findUnique({
            where: {
              email
            }
          });
        } catch (error) {
          logAuthWarning('database_error_find_user', {
            email,
            message: error instanceof Error ? error.message : 'unknown_error'
          });

          if (matchesSeedCredentials) {
            logAuthWarning('database_error_using_env_admin', { email });
            return {
              id: 'env-blog-admin',
              email,
              name: 'Blog Admin'
            };
          }

          return null;
        }

        const isValid = user ? await compare(credentials.password, user.passwordHash) : false;

        if (!isValid) {
          if (!matchesSeedCredentials) {
            logAuthWarning('invalid_credentials', {
              email,
              hasAdminUser: Boolean(user),
              hasSeedCredentials,
              seedEmailMatches: Boolean(seedEmail && email === seedEmail)
            });
            return null;
          }

          const passwordHash = await hash(seedCredentials.password, 12);
          let syncedUser;

          try {
            syncedUser = await db.adminUser.upsert({
              where: {
                email
              },
              update: {
                passwordHash
              },
              create: {
                email,
                name: 'Blog Admin',
                passwordHash
              }
            });
          } catch (error) {
            logAuthWarning('database_error_sync_admin', {
              email,
              message: error instanceof Error ? error.message : 'unknown_error'
            });

            return {
              id: 'env-blog-admin',
              email,
              name: 'Blog Admin'
            };
          }

          return {
            id: syncedUser.id,
            email: syncedUser.email,
            name: syncedUser.name ?? syncedUser.email
          };
        }

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.email = token.email ?? session.user.email ?? '';
        session.user.name = token.name ?? session.user.name;
      }

      return session;
    }
  }
};

const SESSION_COOKIE = 'next-auth.session-token';

type AdminSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const secret = getAuthSecret();

  if (!secret) {
    logAuthWarning('missing_auth_secret');
    return null;
  }

  try {
    const cookieStore = await cookies();

    // Try the exact cookie name first
    let token = cookieStore.get(SESSION_COOKIE)?.value;

    // Also check for __Secure- prefixed cookie
    if (!token) {
      token = cookieStore.get('__Secure-next-auth.session-token')?.value;
    }

    // If not found, check for chunked cookies (NextAuth splits large JWTs)
    if (!token) {
      const allCookies = cookieStore.getAll();
      const chunks: { index: number; value: string }[] = [];

      for (const cookie of allCookies) {
        const match = cookie.name.match(/^(?:__Secure-)?next-auth\.session-token\.(\d+)$/);

        if (match) {
          chunks.push({ index: parseInt(match[1]), value: cookie.value });
        }
      }

      if (chunks.length > 0) {
        chunks.sort((a, b) => a.index - b.index);
        token = chunks.map((c) => c.value).join('');
      }
    }

    if (!token) {
      return null;
    }

    const decoded = await decode({ token, secret });

    if (!decoded?.sub) {
      return null;
    }

    return {
      user: {
        id: decoded.sub,
        email: (decoded.email as string) ?? '',
        name: (decoded.name as string) ?? undefined
      }
    };
  } catch {
    return null;
  }
}

export function isAuthenticatedSession(session: AdminSession | null) {
  return Boolean(session?.user?.id);
}
