import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import styles from './BlogAuthorCard.module.css';

const AUTHOR = {
  name: 'Ignacio Navarro',
  descriptionEs:
    'Ignacio Navarro es Contador Público, fundador de LLC Argentina y asesor especializado en sociedades en Estados Unidos para emprendedores, freelancers y negocios digitales de Latinoamérica. Con formación en tributación internacional y estudios en UCEMA, acompaña a clientes no residentes en la creación y mantenimiento de LLCs, apertura bancaria, facturación, contabilidad e impuestos. Su experiencia combina estrategia fiscal, cumplimiento y visión práctica para operar en EE.UU. de forma simple, ordenada y profesional.',
  descriptionEn:
    'Ignacio Navarro is a Certified Public Accountant, founder of LLC Argentina and a specialist in U.S. companies for entrepreneurs, freelancers and digital businesses in Latin America. With training in international taxation and studies at UCEMA, he advises non-resident clients on forming and maintaining LLCs, opening bank accounts, invoicing, accounting and taxes. His experience combines tax strategy, compliance and practical vision for operating in the U.S. in a simple, organized and professional way.',
  image: '/img/ignacio-navarro.webp',
  socials: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/llcargentina/',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/llcargentina',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      )
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/llcargentina/',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@AdministracionLLCArgentina',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      label: 'WhatsApp',
      href: 'https://api.whatsapp.com/send/?phone=%2B17869354213&text=Hola%2C+vengo+de+LLC+Argentina.+Tengo+algunas+consultas+para+hacerles.&type=phone_number&app_absent=0',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    }
  ]
};

type BlogAuthorCardProps = {
  locale?: Locale;
};

export function BlogAuthorCard({ locale = 'es' }: BlogAuthorCardProps) {
  const en = locale === 'en';

  return (
    <div id="autor" className={styles.card}>
      <div className={styles.header}>
        <Image
          src={AUTHOR.image}
          alt={AUTHOR.name}
          width={80}
          height={80}
          className={styles.avatar}
        />
        <div>
          <p className={styles.label}>{en ? 'Written by' : 'Escrito por'}</p>
          <h3 className={styles.name}>{AUTHOR.name}</h3>
        </div>
      </div>

      <p className={styles.description}>{en ? AUTHOR.descriptionEn : AUTHOR.descriptionEs}</p>

      <div className={styles.socials}>
        {AUTHOR.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
            aria-label={social.label}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
