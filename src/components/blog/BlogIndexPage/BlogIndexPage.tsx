import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/config';
import { getConsultationHref, getWizardHref } from '@/lib/marketing-links';
import { WhatsAppFloatButton } from '@/components/common/WhatsAppFloatButton/WhatsAppFloatButton';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader/SiteHeader';
import { BlogArticlesExplorer } from '@/components/blog/BlogArticlesExplorer/BlogArticlesExplorer';
import { BlogCategoryCard } from '@/components/blog/BlogCategoryCard/BlogCategoryCard';
import type { BlogIndexContent } from '@/lib/blog-content';
import styles from './BlogIndexPage.module.css';

type BlogIndexPageProps = {
  content: BlogIndexContent;
  locale: Locale;
  initialPage?: number;
};

export function BlogIndexPage({ content, locale, initialPage }: BlogIndexPageProps) {
  const en = locale === 'en';
  const consultationHref = getConsultationHref(locale);
  const wizardHref = getWizardHref(locale);

  const breadcrumbItems = [
    { label: en ? 'Home' : 'Inicio', href: getLocalizedPath('/', locale) },
    { label: 'Blog' }
  ];

  return (
    <div className={styles.page}>
      <SiteHeader variant="light-page" />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroBadge}>{en ? 'Blog & Resources' : 'Blog & Recursos'}</div>
              <h1 className={styles.heroTitle}>
                {en ? (
                  <>LLC Argentina Blog:{' '}<br />Your path to doing business in the U.S.</>
                ) : (
                  <>Blog de LLC Argentina:{' '}<br />Tu ruta para emprender en EE.UU.</>
                )}
              </h1>
              <p className={styles.heroSubtitle}>
                {en
                  ? 'Guides, tutorials, and resources for Latin American entrepreneurs operating in the U.S.'
                  : 'Guías, tutoriales y recursos para emprendedores de LATAM que operan en EE.UU.'}
              </p>
            </div>
          </div>
        </section>


        <BlogArticlesExplorer content={content} locale={locale} initialPage={initialPage} breadcrumbItems={breadcrumbItems} />

        <section className={styles.categoriesSection} id="categorias">
          <div className="container">
            <div className="section-label">{en ? 'Category index' : 'Índice por categorías'}</div>
            <h2 className={`t-h2 ${styles.categoriesTitle}`}>{en ? 'Browse by topic' : 'Explorá por tema'}</h2>
            <div className={styles.categoriesGrid}>
              {content.categoryCards.map((category) => (
                <BlogCategoryCard key={category.title} category={category} locale={locale} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className="container">
            <div className={styles.finalCtaInner}>
              <div className={styles.finalCtaLabel}>{en ? 'Free consultation' : 'Consulta gratuita'}</div>
              <h2 className={styles.finalCtaTitle}>
                {en ? (
                  <>Want to open your U.S. company<br />with the right structure?</>
                ) : (
                  <>¿Querés abrir tu empresa en EE.UU.<br />con una estructura correcta?</>
                )}
              </h2>
              <p className={styles.finalCtaSubtitle}>
                {en
                  ? 'We help you choose the state, bank, and tax structure based on your country and business.'
                  : 'Te ayudamos a elegir estado, banco y estructura tributaria según tu país y tu negocio.'}
              </p>
              <div className={styles.finalCtaActions}>
                <Link href={consultationHref} className="btn btn-lg btn-llamada">
                  {en ? 'Book a call' : 'Agendar llamada'}
                </Link>
                <Link href={wizardHref} className={styles.secondaryCta}>
                  {en ? 'See plans & pricing' : 'Ver planes y precios'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppFloatButton />
    </div>
  );
}
