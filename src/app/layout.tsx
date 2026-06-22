import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@/app/globals.css';
import { inter } from '@/lib/fonts';
import { getLocale } from '@/i18n/get-locale';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { CursorDot } from '@/components/common/CursorDot/CursorDot';
import { siteUrl, type Locale } from '@/i18n/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LLC Argentina - Abrí tu LLC en EE.UU. desde LATAM',
    template: '%s - LLC Argentina'
  },
  description:
    'Creamos LLCs en Estados Unidos para latinoamericanos sin residencia ni viajes. Te acompañamos con EIN, banco en dólares y operación online en pocos días hábiles.',
  keywords: [
    'LLC',
    'empresa Estados Unidos',
    'abrir empresa EEUU',
    'LLC para latinos',
    'LLC latinoamerica',
    'cuenta bancaria Mercury',
    'cuenta bancaria Relay',
    'EIN',
    'LATAM',
    'abrir LLC',
    'empresa americana sin residencia',
    'LLC for non-residents',
    'open LLC USA',
    'US LLC Latin America',
    'Mercury bank account'
  ],
  authors: [{ name: 'LLC Argentina', url: siteUrl }],
  creator: 'LLC Argentina',
  publisher: 'LLC Argentina',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: siteUrl,
    siteName: 'LLC Argentina'
  },
  twitter: {
    card: 'summary_large_image'
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
};

export const viewport: Viewport = {
  themeColor: '#006afe',
  width: 'device-width',
  initialScale: 1
};

function getOrganizationSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LLC Argentina',
    alternateName: 'LLCArgentina',
    url: siteUrl,
    logo: `${siteUrl}/brand/llc-argentina-white-text.svg`,
    description:
      locale === 'en'
        ? 'We create U.S. LLCs for Latin Americans with no residency or travel required, including EIN, banking support, and an online process.'
        : 'Creamos LLCs en Estados Unidos para latinoamericanos sin residencia ni viajes, con EIN, acompañamiento bancario y proceso online.',
    foundingDate: '2021',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-786-935-4213',
      email: 'administracion@llcargentina.io',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English'],
      areaServed: ['AR', 'MX', 'CO', 'CL', 'PE', 'VE', 'EC', 'BO', 'UY', 'PY']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '420 SW 7TH ST, SUITE 1015',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      postalCode: '33130',
      addressCountry: 'US'
    },
    sameAs: [
      'https://www.instagram.com/llcargentina/',
      'https://www.linkedin.com/company/llcargentina/',
      'https://www.facebook.com/llcargentina/',
      'https://www.youtube.com/@AdministracionLLCArgentina',
      'https://x.com/llcargentinas',
      'https://www.tiktok.com/@llcargentina',
      'https://es.trustpilot.com/review/www.llcargentina.us'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1400',
      bestRating: '5',
      worstRating: '1'
    }
  };
}

function getWebsiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LLC Argentina',
    url: siteUrl,
    inLanguage: locale,
    availableLanguage: ['es', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager — lazyOnload so it never blocks LCP */}
        <Script id="gtm" strategy="lazyOnload">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PGGTCBQP');
        `}</Script>
      </head>
      <body className={`${inter.variable} ${inter.className}`}>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PGGTCBQP"
            title="Google Tag Manager"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <LocaleProvider locale={locale}>
          {children}
        </LocaleProvider>
        <CursorDot />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema(locale)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteSchema(locale)) }} />
      </body>
    </html>
  );
}
