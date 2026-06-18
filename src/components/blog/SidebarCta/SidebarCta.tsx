import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import styles from './SidebarCta.module.css';

const AVATARS = [
  { src: '/img/avatar-franco.png', alt: 'Franco Caputo' },
  { src: '/img/avatar-jose.png', alt: 'José Milani' },
  { src: '/img/avatar-matias.png', alt: 'Matias Bottero' },
  { src: '/img/avatar-mateo.png', alt: 'Mateo Sanchez' },
  { src: '/img/avatar-gaston.png', alt: 'Gaston Gallardo' }
];

type SidebarCtaProps = {
  locale: Locale;
};

export function SidebarCta({ locale }: SidebarCtaProps) {
  const en = locale === 'en';

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <p className={styles.title}>
          {en ? 'Open your LLC' : 'Abrí tu LLC'}
        </p>
        <p className={styles.highlight}>{en ? 'With clear pricing' : 'Con precio claro'}</p>

        <ul className={styles.features}>
          <li>{en ? 'Ready in around 7 business days' : 'Lista en aprox. 7 días hábiles'}</li>
          <li>{en ? 'Starting at $599 USD' : 'A partir de $599 USD'}</li>
          <li>{en ? 'Online process' : 'Proceso online'}</li>
        </ul>

        <Link
          href="https://wa.me/17869354213?text=Hola%2C%20quiero%20abrir%20mi%20LLC"
          className={styles.button}
        >
          {en ? 'Book a free consultation' : 'Reservá una asesoría gratis'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        <div className={styles.social}>
          <div className={styles.avatars}>
            {AVATARS.map((avatar) => (
              <Image
                key={avatar.src}
                src={avatar.src}
                alt={avatar.alt}
                width={32}
                height={32}
                className={styles.avatar}
              />
            ))}
          </div>
          <div className={styles.proof}>
            <span className={styles.proofLabel}>{en ? '+300 LLCs opened' : '+300 LLCs abiertas'}</span>
            <span className={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className={styles.rating}>4.8/5</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
