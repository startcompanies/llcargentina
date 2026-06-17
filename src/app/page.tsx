import type { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage/HomePage';
import type { BlogCompactArticle } from '@/lib/blog-content';
import { isDatabaseConfigured } from '@/lib/app-config';
import { getAllBlogArticlesFromDatabase } from '@/lib/blog-content-db';
import { getLocale } from '@/i18n/get-locale';
import { getAlternateUrls } from '@/i18n/config';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const alts = getAlternateUrls('/');

  if (locale === 'en') {
    return {
      title: 'LLC Argentina - Open your U.S. LLC from Latin America',
      description:
        'We form your LLC and open your bank account with Mercury, Relay, or Lili Bank. 100% online in 7 business days. No residency or travel required.',
      alternates: { canonical: alts.en, languages: { es: alts.es, en: alts.en } },
      openGraph: {
        title: 'LLC Argentina - Open your U.S. LLC from Latin America',
        description: 'We form your LLC and open your bank account with Mercury, Relay, or Lili Bank. 100% online in 7 business days.',
        locale: 'en_US'
      }
    };
  }

  return {
    title: 'LLC Argentina - Abrí tu LLC en EE.UU. desde LATAM',
    description:
      'Formamos tu LLC y abrimos tu cuenta bancaria en Mercury, Relay o Lili Bank. 100% online en 7 días hábiles. Sin residencia ni viajes a EE.UU.',
    alternates: { canonical: alts.es, languages: { es: alts.es, en: alts.en } }
  };
}

async function getRecentPosts(): Promise<BlogCompactArticle[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const articles = await getAllBlogArticlesFromDatabase();

    return articles.slice(0, 3).map((article) => ({
      slug: article.slug,
      title: article.title,
      category: article.badge,
      imageSrc: article.ogImage ?? '',
      imageAlt: article.title,
      meta: article.description
    }));
  } catch {
    return [];
  }
}

export default async function HomePageRoute() {
  const [locale, recentPosts] = await Promise.all([getLocale(), getRecentPosts()]);

  return <HomePage recentPosts={recentPosts} locale={locale} />;
}
