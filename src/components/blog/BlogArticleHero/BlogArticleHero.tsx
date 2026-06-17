import Image from 'next/image';
import Link from 'next/link';
import styles from './BlogArticleHero.module.css';

const AUTHOR_NAME = 'Ignacio Navarro';
const AUTHOR_IMAGE = '/img/ignacio-navarro.webp';

type BlogArticleHeroProps = {
  badge: string;
  titleHtml: string;
  subtitle: string;
  metaItems: string[];
  image?: string;
  categoryHref?: string;
};

function MetaIcon({ item, index }: { item: string; index: number }) {
  const normalized = item.toLowerCase();

  if (normalized.includes('lectura') || normalized.includes('min')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3 2" />
      </svg>
    );
  }

  if (normalized.includes('publicado') || /\d{4}/.test(normalized)) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
        <path d="M7 3.5v4M17 3.5v4M3.5 9.5h17" />
      </svg>
    );
  }

  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 5.5h8l3 3v10a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z" />
        <path d="M14.5 5.5v3h3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-6-3.35-6-9a6 6 0 0 1 12 0c0 5.65-6 9-6 9z" />
      <circle cx="12" cy="12" r="2.3" />
    </svg>
  );
}

export function BlogArticleHero({ badge, titleHtml, subtitle, metaItems, image, categoryHref }: BlogArticleHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className="container">
        <div className={`${styles.inner} ${image ? styles.withImage : ''}`}>
          <div className={styles.text}>
            {categoryHref ? (
              <Link href={categoryHref} className={styles.badge}>{badge}</Link>
            ) : (
              <div className={styles.badge}>{badge}</div>
            )}
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: titleHtml }} />
            <p className={styles.subtitle}>{subtitle}</p>
            <div className={styles.meta}>
              {metaItems.map((item, index) => {
                if (index === 0 && categoryHref) {
                  return (
                    <Link key={item} href={categoryHref} className={styles.metaItem}>
                      <span className={styles.metaIcon}>
                        <MetaIcon item={item} index={index} />
                      </span>
                      <span>{item}</span>
                    </Link>
                  );
                }
                return (
                  <span key={item} className={styles.metaItem}>
                    <span className={styles.metaIcon}>
                      <MetaIcon item={item} index={index} />
                    </span>
                    <span>{item}</span>
                  </span>
                );
              })}
              <a href="#autor" className={styles.metaItem}>
                <Image
                  src={AUTHOR_IMAGE}
                  alt={AUTHOR_NAME}
                  width={28}
                  height={28}
                  className={styles.authorAvatar}
                />
                <span>{AUTHOR_NAME}</span>
              </a>
            </div>
          </div>

          {image && (
            <div className={styles.imageWrap}>
              <Image
                src={image}
                alt=""
                width={480}
                height={320}
                className={styles.image}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
