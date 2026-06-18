import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { SiteHeader } from '@/components/layout/SiteHeader/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter';
import { ArrowIcon } from '@/components/common/ArrowIcon/ArrowIcon';
import { WhatsAppFloatButton } from '@/components/common/WhatsAppFloatButton/WhatsAppFloatButton';
import { ScrollReveal } from '@/components/animations/ScrollReveal/ScrollReveal';

const LaserFlow = dynamic(
  () => import('@/components/home/LaserFlow/LaserFlow').then((m) => m.LaserFlow)
);

const HomeInteractiveShell = dynamic(
  () => import('@/components/home/HomeInteractiveShell/HomeInteractiveShell').then((m) => m.HomeInteractiveShell)
);
import { getConsultationHref, getWizardHref, getRenewHref } from '@/lib/marketing-links';
import * as dataEs from '@/data/home';
import * as dataEn from '@/data/en/home';
import type { Locale } from '@/i18n/config';
import type { BlogCompactArticle } from '@/lib/blog-content';
import styles from './HomePage.module.css';

type HomePageProps = {
  recentPosts: BlogCompactArticle[];
  locale: Locale;
};

export function HomePage({ recentPosts, locale }: HomePageProps) {
  const data = locale === 'en' ? dataEn : dataEs;
  const consultationHref = getConsultationHref(locale);
  const wizardHref = getWizardHref(locale);
  const renewHref = getRenewHref(locale);

  return (
    <main>
      <SiteHeader variant="transparent" />

      {/* ── HERO ── */}
      <div className={styles.heroShell}>
        <LaserFlow
          className={styles.heroBackground}
          color="#006AFE"
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0}
          horizontalSizing={0.5}
          verticalSizing={2}
          wispDensity={1}
          wispSpeed={15}
          wispIntensity={5}
          flowSpeed={0.35}
          flowStrength={0.25}
          fogIntensity={0.45}
          fogScale={0.3}
          fogFallSpeed={0.6}
          decay={1.1}
          falloffStart={1.2}
        />
        <div className={styles.heroOverlay} />

        <section className={`${styles.hero} hero`} id="hero">
          <canvas className={`${styles.heroCanvas} hero-canvas`} id="heroCanvas" aria-hidden="true" />
          <div className={styles.heroGlow1} aria-hidden="true" />
          <div className={styles.heroGlow2} aria-hidden="true" />

          <div className={`container ${styles.heroInner}`}>

            {/* LEFT: Copy */}
            <div className="hero-content">
              <div className={styles.heroTrust} data-anim="heroTrust">
                <span className={styles.heroTrustPulse} aria-hidden="true" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#00b67a" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className={styles.heroTrustScore}>{locale === 'en' ? '4.9 Trustpilot' : '4.9 Trustpilot'}</span>
                <span className={styles.heroTrustSep} aria-hidden="true" />
                <span className={styles.heroTrustText}>{locale === 'en' ? '+1,400 entrepreneurs chose us' : '+1,400 emprendedores ya nos eligieron'}</span>
              </div>

              <h1 className={styles.heroTitle} data-anim="heroTitle">
                {locale === 'en' ? 'Your company in ' : 'Tu empresa en '}<br />{locale === 'en' ? 'the United States, ' : 'Estados Unidos, '}<br />
                <span
                  className={styles.heroTitleGrad}
                  data-anim="heroTitleGrad"
                  data-rotate-texts={data.heroRotatingTexts.join('|')}
                >
                  {data.heroRotatingTexts[0]}
                </span>
              </h1>

              <p className={styles.heroSub} data-anim="heroSub">
                {locale === 'en'
                  ? <><strong>Build with more freedom.</strong> We create LLCs and support bank account setup for Latin Americans without residency. Fully online.</>
                  : <><strong>Expandí tu libertad.</strong> Creamos LLCs y abrimos cuentas bancarias para latinoamericanos sin residencia. Todo online.</>
                }
              </p>

              <div className={styles.heroActions} data-anim="heroActions">
                <Link href={wizardHref} className="btn btn-comenzar btn-lg">
                  {locale === 'en' ? 'Open my LLC' : 'Abrir mi LLC'}{' '}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href={consultationHref} className="btn btn-llamada btn-lg">
                  {locale === 'en' ? 'Book free call' : 'Reservar llamada gratuita'}
                </Link>
              </div>

              <div className={styles.heroCounters} data-anim="heroCounters">
                <div className={styles.heroCounter}>
                  <span className={styles.heroCounterNum} data-target="1400" data-suffix="+" data-prefix="">0</span>
                  <span className={styles.heroCounterLabel}>{locale === 'en' ? 'Founders advised' : 'Fundadores asesorados'}</span>
                </div>
                <div className={styles.heroCounter}>
                  <span className={styles.heroCounterNum} data-target="1000" data-suffix="+" data-prefix="">0</span>
                  <span className={styles.heroCounterLabel}>{locale === 'en' ? 'LLCs opened' : 'LLCs abiertas'}</span>
                </div>
                <div className={styles.heroCounter}>
                  <span className={styles.heroCounterNum} data-target="4.9" data-suffix="★" data-prefix="">0</span>
                  <span className={styles.heroCounterLabel}>{locale === 'en' ? '4.9 on Trustpilot' : '4.9 en Trustpilot'}</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Floating pricing card */}
            <div className={styles.heroCardWrap} data-anim="heroCardWrap">
              <div className={styles.heroCard}>
                <div className={styles.heroCardHead}>
                  <span className={styles.heroCardName}>{locale === 'en' ? 'Starter Pack' : 'Pack Emprendedor'}</span>
                  <span className={styles.heroCardPopular}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {' '}{locale === 'en' ? 'Client favorite' : 'El más elegido'}
                  </span>
                </div>
                <div className={styles.heroCardPrice}>
                  <span className={styles.heroCardAmount}>$599</span>
                  <span className={styles.heroCardCurrency}>USD</span>
                </div>
                <div className={styles.heroCardFree}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {' '}{locale === 'en' ? '3 free months of platform access' : '3 meses gratis de plataforma'}
                </div>
                <div className={styles.heroCardFreeSub}>{locale === 'en' ? 'Then $25 USD/mo' : 'Luego $25 USD/mes'}</div>
                <div className={styles.heroCardDiv} aria-hidden="true" />
                <ul className={styles.heroCardFeatures}>
                  {(locale === 'en' ? [
                    'U.S. LLC (Single Member)',
                    'Bank account support included',
                    'EIN included',
                    'R.A. + Tax address + Operating Agreement',
                  ] : [
                    'LLC en EE.UU. (Single Member)',
                    'Acompañamiento bancario incluido',
                    'EIN incluido',
                    'R.A. + Dirección fiscal + Operating Agreement',
                  ]).map((feature) => (
                    <li key={feature} className={styles.hcfItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {' '}{feature}
                    </li>
                  ))}
                  <li className={styles.hcfItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {' '}{locale === 'en' ? 'Digital platform:' : 'Plataforma digital:'}
                  </li>
                  {(locale === 'en' ? ['AI Accounting', 'USD Invoicing', 'Legal library'] : ['Contabilidad IA', 'Facturación USD', 'Biblioteca legal']).map((sub) => (
                    <li key={sub} className={styles.hcfSub}>
                      <span className={styles.hcfDot} aria-hidden="true" />
                      {sub}
                    </li>
                  ))}
                  {(locale === 'en' ? ['International tax guidance', '24/7 Support'] : ['Orientación tributaria internacional', 'Soporte 24/7']).map((feature) => (
                    <li key={feature} className={styles.hcfItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {' '}{feature}
                    </li>
                  ))}
                </ul>
                <div className={styles.heroCardDays}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {' '}{locale === 'en' ? 'in 7 business days' : 'en 7 días hábiles'}
                </div>
                <Link href={wizardHref} className={styles.heroCardCta}>
                  {locale === 'en' ? 'Get started' : 'Empezar ahora'}{' '}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ── SERVICIOS ── */}
      <section className={styles.serviciosSec} id="servicios">
        <div className={styles.serviciosBgGlow} aria-hidden="true" />
        <div className="container">
          <ScrollReveal className={styles.serviciosHeader}>
            <h2 className={styles.serviciosTitle}>{locale === 'en' ? <>Everything your company needs to<br /><span className={styles.gradText}>operate from the U.S.</span></> : <>Todo lo necesario para<br /><span className={styles.gradText}>operar desde EE.UU.</span></>}</h2>
            <p className={styles.serviciosSub}>{locale === 'en' ? 'Certified Public Accountants and IRS Enrolled Agents supporting each step of your company.' : 'Contadores Públicos y Enrolled Agents certificados ante el IRS, acompañando cada etapa de tu empresa.'}</p>
          </ScrollReveal>
          <ScrollReveal effect="fade-up" stagger={0.1} className={styles.serviciosGrid}>
            {/* 1 — Constitucion LLC */}
            <article className={styles.srvCard}>
              <div className={styles.srvCardGlow} aria-hidden="true" />
              <div className={styles.srvIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                  <circle cx="19" cy="5" r="4" fill="none" /><polyline points="17 5 19 7 22 4" />
                </svg>
              </div>
              <div className={styles.srvNum} aria-hidden="true">01</div>
              <h3 className={styles.srvTitle}>{locale === 'en' ? 'LLC, Holding & C-Corporation Setup' : 'Apertura de LLC, Holdings y C-Corporaciones'}</h3>
              <p className={styles.srvDesc}>{locale === 'en' ? 'We set up your company in the U.S. with the structure your business actually needs: LLC, Holding, or C-Corp.' : 'Creamos tu empresa en EE.UU. con la estructura que tu operación necesita: LLC, Holding o C-Corp.'}</p>
              <div className={styles.srvTag}>LLC · Corp · Holdings</div>
            </article>
            {/* 2 — Declaracion Impuestos */}
            <article className={styles.srvCard}>
              <div className={styles.srvCardGlow} aria-hidden="true" />
              <div className={styles.srvIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  <polyline points="7 10 10 13 17 7" />
                </svg>
              </div>
              <div className={styles.srvNum} aria-hidden="true">02</div>
              <h3 className={styles.srvTitle}>{locale === 'en' ? 'Tax Filing for Residents & Non-Residents' : 'Impuestos para residentes y no residentes'}</h3>
              <p className={styles.srvDesc}>{locale === 'en' ? 'Forms 5472, 1120, 1065 and IRS compliance, handled by certified Enrolled Agents.' : 'Formularios 5472, 1120, 1065 y cumplimiento IRS, gestionados por Enrolled Agents certificados.'}</p>
              <div className={styles.srvTag}>IRS · Form 1120 · 5472 · 1065</div>
            </article>
            {/* 3 — Apertura Bancaria */}
            <article className={styles.srvCard}>
              <div className={styles.srvCardGlow} aria-hidden="true" />
              <div className={styles.srvIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                  <circle cx="7" cy="15" r="1.5" fill="#01C9E2" /><line x1="11" y1="15" x2="18" y2="15" />
                </svg>
              </div>
              <div className={styles.srvNum} aria-hidden="true">03</div>
              <h3 className={styles.srvTitle}>{locale === 'en' ? 'U.S. Bank Account Setup' : 'Apertura de cuenta bancaria'}</h3>
              <p className={styles.srvDesc}>{locale === 'en' ? 'Mercury, Relay, Lili and Chase options, with a guided online process for non-resident founders.' : 'Opciones con Mercury, Relay, Lili y Chase, con un proceso guiado para founders no residentes.'}</p>
              <div className={styles.srvTag}>Mercury · Relay · Chase</div>
            </article>
            {/* 4 — Solicitud ITIN */}
            <article className={styles.srvCard}>
              <div className={styles.srvCardGlow} aria-hidden="true" />
              <div className={styles.srvIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  <line x1="19" y1="8" x2="23" y2="8" /><line x1="21" y1="6" x2="21" y2="10" />
                </svg>
              </div>
              <div className={styles.srvNum} aria-hidden="true">04</div>
              <h3 className={styles.srvTitle}>{locale === 'en' ? 'ITIN Application' : 'Solicitud de ITIN'}</h3>
              <p className={styles.srvDesc}>{locale === 'en' ? 'We request your Individual Taxpayer Identification Number with the IRS so you can operate without an SSN.' : 'Solicitamos tu Individual Taxpayer Identification Number ante el IRS para operar sin SSN.'}</p>
              <div className={styles.srvTag}>ITIN · IRS · {locale === 'en' ? 'No SSN' : 'Sin SSN'}</div>
            </article>
            {/* 5 — Plataforma para operar tu LLC */}
            <article className={`${styles.srvCard} ${styles.srvCardWide} ${styles.srvCard5}`}>
              <div className={`${styles.srvCardGlow} ${styles.srvCardGlowGold}`} aria-hidden="true" />
              <div className={`${styles.srvNum} ${styles.srvNumGold}`} aria-hidden="true">05</div>
              <div className={styles.srvCard5Grid}>
                {/* Text */}
                <div className={styles.srvCard5Text}>
                  <span className={styles.srvCard5Badge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="12 2 15 9 22 10 17 15 18 22 12 18 6 22 7 15 2 10 9 9" />
                    </svg>
                    {locale === 'en' ? 'EXCLUSIVE' : 'EXCLUSIVO'}
                  </span>
                  <div className={`${styles.srvIconWrap} ${styles.srvIconWrapGold}`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#01C9E2" aria-hidden="true">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
                    </svg>
                  </div>
                  <h3 className={styles.srvTitle}>{locale === 'en' ? 'Platform to operate your LLC' : 'Plataforma para operar tu LLC'}</h3>
                  <p className={styles.srvDesc}>
                    {locale === 'en'
                      ? <>{'Manage your company from one place and '}<span className={styles.srvHighlight}>stay ahead of deadlines, fines, and bank issues</span>.</>
                      : <>{'Gestioná tu empresa desde un solo panel y '}<span className={styles.srvHighlight}>anticipá vencimientos, multas y problemas bancarios</span>.</>}
                  </p>
                  <div className={styles.srvCard5Pills}>
                    {(locale === 'en'
                      ? ['USD Invoicing', 'AI Accounting', 'Documents', 'Guides + videos']
                      : ['Facturador USD', 'Contabilidad IA', 'Documentos', 'Guías + videos']
                    ).map((pill) => (
                      <span key={pill} className={styles.srvPill}>{pill}</span>
                    ))}
                  </div>
                  <div className={styles.srvCard5ComingSoon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {locale === 'en' ? <>{'Upcoming: '}<strong>USDC Account</strong></> : <>{'Próximamente: '}<strong>Cuenta en USDC</strong></>}
                  </div>
                </div>
                {/* Dashboard mockup */}
                <div className={styles.srvMockup5} aria-hidden="true">
                  <aside className={styles.srvMockup5Side}>
                    <div className={styles.srvMockup5Brand}>
                      <span className={styles.srvMockup5BrandDot} />
                      <span className={styles.srvMockup5BrandName}>LLC</span>
                    </div>
                    <ul className={styles.srvMockup5Nav}>
                      <li className={styles.srvMockup5NavActive}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                        Dashboard
                      </li>
                      <li>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        Solicitudes
                      </li>
                      <li>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        Facturación
                      </li>
                      <li>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                        Contabilidad
                      </li>
                      <li>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                        Documentos
                      </li>
                      <li>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                        Videos
                      </li>
                      <li>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                        {'Guías LLC'}
                      </li>
                    </ul>
                  </aside>
                  <div className={styles.srvMockup5Main}>
                    <div className={styles.srvMockup5Head}>
                      <div>
                        <div className={styles.srvMockup5HeadTitle}>Tu LLC en EE.UU.</div>
                        <div className={styles.srvMockup5HeadSub}>Resumen general · Wyoming</div>
                      </div>
                      <span className={styles.srvMockup5Status}>Activa</span>
                    </div>
                    <div className={styles.srvMockup5Kpis}>
                      <div className={styles.srvMockup5Kpi}>
                        <div className={styles.srvMockup5KpiLabel}>Facturación</div>
                        <div className={styles.srvMockup5KpiValue}>$12,840</div>
                        <div className={styles.srvMockup5KpiTrend}>▲ 18% vs mes ant.</div>
                      </div>
                      <div className={styles.srvMockup5Kpi}>
                        <div className={styles.srvMockup5KpiLabel}>Cuenta Mercury</div>
                        <div className={styles.srvMockup5KpiValue}>$8,420</div>
                        <div className={`${styles.srvMockup5KpiTrend} ${styles.neutral}`}>Sincronizada hoy</div>
                      </div>
                      <div className={styles.srvMockup5Kpi}>
                        <div className={styles.srvMockup5KpiLabel}>Compliance</div>
                        <div className={styles.srvMockup5KpiValue}>100%</div>
                        <div className={styles.srvMockup5KpiTrend}>Al día</div>
                      </div>
                    </div>
                    <div className={styles.srvMockup5Chart}>
                      <div className={styles.srvMockup5ChartHead}>
                        <span className={styles.srvMockup5ChartTitle}>Ingresos · últimos 6 meses</span>
                        <span className={styles.srvMockup5ChartAmount}>+$58,420</span>
                      </div>
                      <div className={styles.srvMockup5Bars}>
                        <div className={styles.srvMockup5Bar} style={{ height: '35%' }} />
                        <div className={styles.srvMockup5Bar} style={{ height: '50%' }} />
                        <div className={styles.srvMockup5Bar} style={{ height: '42%' }} />
                        <div className={styles.srvMockup5Bar} style={{ height: '68%' }} />
                        <div className={styles.srvMockup5Bar} style={{ height: '78%' }} />
                        <div className={styles.srvMockup5Bar} style={{ height: '92%' }} />
                      </div>
                    </div>
                    <div className={styles.srvMockup5SectionTitle}>Próximos vencimientos</div>
                    <div className={styles.srvMockup5Row}>
                      <div className={`${styles.srvMockup5RowIcon} ${styles.blue}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>
                      </div>
                      <div className={styles.srvMockup5RowInfo}>
                        <div className={styles.srvMockup5RowTitle}>Declaración de impuestos</div>
                        <div className={styles.srvMockup5RowSub}>Vence en 30 días</div>
                      </div>
                      <span className={`${styles.srvMockup5Tag} ${styles.tagBlue}`}>En curso</span>
                    </div>
                    <div className={styles.srvMockup5Row}>
                      <div className={`${styles.srvMockup5RowIcon} ${styles.amber}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                      </div>
                      <div className={styles.srvMockup5RowInfo}>
                        <div className={styles.srvMockup5RowTitle}>Annual Report Wyoming</div>
                        <div className={styles.srvMockup5RowSub}>Vence en 42 días</div>
                      </div>
                      <span className={`${styles.srvMockup5Tag} ${styles.tagAmber}`}>Próximo</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </ScrollReveal>
          <ScrollReveal className={styles.serviciosCta}>
            <Link href={wizardHref} className="btn btn-comenzar btn-lg">{locale === 'en' ? 'Start process' : 'Iniciar proceso'} <ArrowIcon /></Link>
            <Link href={consultationHref} className="btn btn-llamada btn-lg">{locale === 'en' ? 'Book free call' : 'Reservar llamada gratuita'}</Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PARTNERS MARQUEE ── */}
      <section className={styles.partners} id="partners">
        <div className={`container ${styles.partnersHeader}`}>
          <h2 className={styles.partnersTitle}>{locale === 'en' ? 'We connect your company with leading banks and platforms' : 'Conectamos tu empresa con bancos y plataformas líderes'}</h2>
        </div>
        <div className={styles.marqueeOuter}>
          <div className={styles.marqueeFadeL} aria-hidden="true" />
          <div className={styles.marqueeFadeR} aria-hidden="true" />
          <div className={styles.marqueeTrack} id="marqueeTrack">
            {/* Set 1 */}
            <div className={styles.marqueeSet}>
              <div className={styles.partnerLogo}>
                <Image src="https://www.datocms-assets.com/115132/1743087413-mercury-logo.png" alt="Mercury" width={120} height={40} style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <div className={styles.partnerLogo}>
                <Image src="/img/partners/relay-logo.svg" alt="Relay" width={100} height={40} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className={styles.partnerLogo}>
                <Image src="/img/partners/chase-logo.svg" alt="Chase" width={100} height={40} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className={styles.partnerLogo}>
                <Image src="https://lili.co/wp-content/uploads/2025/11/lili-white.svg" alt="Lili Bank" width={80} height={40} style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <div className={styles.partnerLogo}>
                <svg width="140" height="36" viewBox="0 0 240 60" aria-label="QuickBooks" role="img">
                  <text x="0" y="44" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="36" fill="#2CA01C">QuickBooks</text>
                </svg>
              </div>
            </div>
            {/* Set 2 (duplicate for seamless loop) */}
            <div className={styles.marqueeSet} aria-hidden="true">
              <div className={styles.partnerLogo}>
                <Image src="https://www.datocms-assets.com/115132/1743087413-mercury-logo.png" alt="" width={120} height={40} style={{ objectFit: 'contain' }} loading="eager" unoptimized />
              </div>
              <div className={styles.partnerLogo}>
                <Image src="/img/partners/relay-logo.svg" alt="" width={100} height={40} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} loading="eager" />
              </div>
              <div className={styles.partnerLogo}>
                <Image src="/img/partners/chase-logo.svg" alt="" width={100} height={40} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} loading="eager" />
              </div>
              <div className={styles.partnerLogo}>
                <Image src="https://lili.co/wp-content/uploads/2025/11/lili-white.svg" alt="" width={80} height={40} style={{ objectFit: 'contain' }} loading="eager" unoptimized />
              </div>
              <div className={styles.partnerLogo}>
                <svg width="140" height="36" viewBox="0 0 240 60" aria-hidden="true">
                  <text x="0" y="44" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="36" fill="#2CA01C">QuickBooks</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LLC BENEFITS ── */}
      <section className={styles.llcBenefits} id="por-que-llc">
        <div className="container">
          <ScrollReveal className={styles.llcHeader}>
            <h2 className={styles.llcTitle}>{locale === 'en' ? 'Why entrepreneurs choose a U.S. LLC' : 'Por qué los emprendedores eligen una LLC en EE.UU.'}</h2>
          </ScrollReveal>
          <ScrollReveal effect="scale-up" stagger={0.1} className={styles.llcGrid}>
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ),
                title: locale === 'en' ? 'Global access' : 'Acceso global',
                text: locale === 'en' ? 'Sell globally and collect through Stripe, transfers, and international platforms with a stronger setup.' : 'Vendé globalmente y cobrá por Stripe, transferencias y plataformas internacionales con una estructura más sólida.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: locale === 'en' ? 'Asset protection' : 'Protección patrimonial',
                text: locale === 'en' ? 'Separate your business from your personal profile and reduce exposure with limited liability.' : 'Separá tu negocio de tu persona y reducí exposición con responsabilidad limitada.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                ),
                title: locale === 'en' ? 'International credibility' : 'Credibilidad internacional',
                text: locale === 'en' ? 'Invoice global clients with cleaner contracts and a recognized U.S. legal structure.' : 'Facturá a clientes globales con contratos más claros y una estructura legal reconocida.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
                title: locale === 'en' ? 'Tax efficiency' : 'Eficiencia fiscal',
                text: locale === 'en' ? 'Structure your operation as a non-resident and understand when U.S. federal tax may not apply.' : 'Ordená tu operación como no residente y entendé cuándo puede no aplicar impuesto federal en EE.UU.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                ),
                title: locale === 'en' ? 'USD bank account' : 'Banco en USD',
                text: locale === 'en' ? 'Operate in dollars with Mercury, Relay, or other banking options suited for U.S. companies.' : 'Operá en dólares con Mercury, Relay u otras opciones bancarias pensadas para empresas estadounidenses.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
                title: locale === 'en' ? '100% online' : '100% online',
                text: locale === 'en' ? 'No residency or travel required. Complete the process from your computer, wherever you are in LATAM.' : 'Sin residencia ni viajes. Completá el proceso desde tu computadora, estés donde estés en LATAM.'
              }
            ].map((benefit, i) => (
              <div key={benefit.title} className={styles.llcCard}>
                <div className={styles.llcCardHead}>
                  <div className={styles.llcIconWrap}>{benefit.icon}</div>
                  <h3 className={styles.llcCardTitle}>{benefit.title}</h3>
                </div>
                <p className={styles.llcCardText}>{benefit.text}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section className={styles.proceso} id="proceso">
        <div className="container">
          <ScrollReveal className={styles.procesoHeader}>
            <h2 className={styles.procesoTitle}>{locale === 'en' ? <>Your LLC moving in <span className={styles.gradText}>7 business days</span></> : <>Tu LLC en marcha en <span className={styles.gradText}>7 días hábiles</span></>}</h2>
            <p className={styles.procesoSub}>{locale === 'en' ? 'A guided process with no in-person paperwork and no unnecessary friction.' : 'Un proceso guiado, sin papeles presenciales ni fricción innecesaria.'}</p>
          </ScrollReveal>
          <div className={styles.procesoLayout}>
            {/* LEFT: steps */}
            <div className={styles.procesoStepsCol}>
              <div className={styles.procesoVline} aria-hidden="true">
                <div className={styles.procesoVlineFill} id="procesoVLine" />
              </div>
              <ScrollReveal effect="fade-up" stagger={0.12}>
                {[
                  {
                    step: 1,
                    title: locale === 'en' ? 'Submit your information' : 'Cargás tus datos',
                    text: locale === 'en' ? 'Share your personal and business details through a simple online form.' : 'Compartís tus datos personales y los del negocio en un formulario online simple.',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    ),
                    done: false
                  },
                  {
                    step: 2,
                    title: locale === 'en' ? 'Access your dashboard' : 'Accedés a tu panel',
                    text: locale === 'en' ? 'We create your platform account so you can follow each stage of the setup.' : 'Creamos tu usuario en la plataforma para que sigas cada etapa de la apertura.',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    ),
                    done: false
                  },
                  {
                    step: 3,
                    title: locale === 'en' ? 'We guide the banking setup' : 'Guiamos la apertura bancaria',
                    text: locale === 'en' ? 'We prepare the banking application and guide you through Mercury, Relay, or the best available option.' : 'Preparamos la solicitud bancaria y te guiamos con Mercury, Relay o la mejor opción disponible.',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    ),
                    done: false
                  },
                  {
                    step: 4,
                    title: locale === 'en' ? 'LLC approved with documents' : 'LLC aprobada con documentos',
                    text: locale === 'en' ? 'You receive Articles of Organization, Operating Agreement, and EIN, available from your dashboard.' : 'Recibís Articles of Organization, Operating Agreement y EIN, disponibles desde tu panel.',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    ),
                    done: false
                  },
                  {
                    step: 5,
                    title: locale === 'en' ? 'Process complete' : 'Proceso finalizado',
                    text: locale === 'en' ? 'Your U.S. company is ready to operate, with dashboard, accounting, invoices, and legal resources included.' : 'Tu empresa estadounidense queda lista para operar, con panel, contabilidad, facturas y recursos legales incluidos.',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ),
                    done: true
                  }
                ].map(({ step, title, text, icon, done }) => (
                  <div key={step} className={styles.procesoStep} data-step={step}>
                    <div className={styles.procesoNumWrap}>
                      <div className={`${styles.procesoNum}${done ? ` ${styles.procesoNumDone}` : ''}`}>
                        {icon}
                      </div>
                      <div className={styles.procesoStepNum}>0{step}</div>
                    </div>
                    <div className={styles.procesoStepBody}>
                      <h3 className={styles.procesoStepTitle}>
                        {title}
                      </h3>
                      <p className={styles.procesoStepText}>{text}</p>
                      {done && <span className={styles.procesoDoneBadge}>{locale === 'en' ? 'Ready to invoice' : 'Listo para facturar'}</span>}
                    </div>
                  </div>
                ))}
              </ScrollReveal>
            </div>
            {/* RIGHT: sticky status card */}
            <div className={styles.procesoCardCol} aria-hidden="true">
              <div className={styles.procesoStatusCard}>
                <div className={styles.pscHeader}>
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <circle cx="5" cy="5" r="5" fill="#22c55e" opacity="0.3" />
                    <circle cx="5" cy="5" r="3" fill="#22c55e" />
                  </svg>
                  {' '}{locale === 'en' ? 'Your process status' : 'Estado de tu proceso'}
                </div>
                <div className={styles.pscBars}>
                  {(locale === 'en' ? [
                    { id: 1, name: 'Form', target: 20 },
                    { id: 2, name: 'LLC approved', target: 40 },
                    { id: 3, name: 'EIN approved', target: 60 },
                    { id: 4, name: 'Bank account', target: 80 },
                    { id: 5, name: 'Platform active', target: 100 },
                  ] : [
                    { id: 1, name: 'Formulario', target: 20 },
                    { id: 2, name: 'LLC aprobada', target: 40 },
                    { id: 3, name: 'EIN aprobado', target: 60 },
                    { id: 4, name: 'Cuenta bancaria', target: 80 },
                    { id: 5, name: 'Plataforma activa', target: 100 },
                  ]).map(({ id, name, target }) => (
                    <div key={id} className={styles.pscBarItem}>
                      <div className={styles.pscBarMeta}>
                        <span className={styles.pscBarName}>{name}</span>
                        <span className={styles.pscBarPct} id={`pPct${id}`}>0%</span>
                      </div>
                      <div className={styles.pscBarTrack}>
                        <div className={styles.pscBarFill} id={`pFill${id}`} data-target={target} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`${styles.pscDone}`} id="pscDone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {' '}{locale === 'en' ? '100% online · No travel required' : '100% online · Sin viajes'}
                </div>
                <div className={styles.pscFooter}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {' '}{locale === 'en' ? '7-day average setup time' : '7 días promedio de apertura'}
                </div>
              </div>
            </div>
          </div>

          {/* Panel features row */}
          <ScrollReveal className={styles.procesoPanel}>
            <div className={styles.procesoPanelLabel}>{locale === 'en' ? 'Inside your dashboard' : 'Dentro de tu panel'}</div>
            <div className={styles.procesoPanelFeatures}>
              {[
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>, label: locale === 'en' ? 'AI Accounting' : 'Contabilidad con IA' },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>, label: locale === 'en' ? 'USD Invoices' : 'Facturas en USD' },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>, label: locale === 'en' ? 'Legal library' : 'Biblioteca legal' },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, label: locale === 'en' ? 'Compliance reminders' : 'Recordatorios de cumplimiento' },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>, label: locale === 'en' ? '24/7 Support' : 'Soporte 24/7' },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>, label: locale === 'en' ? 'LLC video lessons' : 'Videos prácticos LLC' },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>, label: locale === 'en' ? 'LLC Roadmap' : 'Roadmap de tu LLC' },
              ].map(({ icon, label }) => (
                <div key={label} className={styles.ppfItem}>
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className={styles.procesoCta}>
            <Link href={wizardHref} className="btn btn-comenzar btn-lg">
              {locale === 'en' ? 'Get started' : 'Iniciar ahora'}{' '}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href={consultationHref} className="btn btn-llamada btn-lg">{locale === 'en' ? 'Book free call' : 'Reservar llamada gratuita'}</Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ELEGIRNOS ── */}
      <section className={styles.elegirnos} id="por-que-elegirnos">
        <div className="container">
          <ScrollReveal className={styles.elegirHeader}>
            <h2 className={styles.elegirTitle}>{locale === 'en' ? 'Why work with us?' : '¿Por qué trabajar con nosotros?'}</h2>
            <p className={styles.elegirSub}>{locale === 'en' ? 'More than 1,400 Latin American entrepreneurs chose LLC Argentina to form, maintain, and operate their U.S. company.' : 'Más de 1,400 emprendedores de LATAM eligieron LLC Argentina para crear, mantener y operar su empresa en EE.UU.'}</p>
          </ScrollReveal>
        </div>
        {/* Stats block */}
        <div className={styles.elegirStatsWrap}>
          <div className="container">
            <ScrollReveal className={styles.elegirStats}>
              <div className={styles.elegirStat}>
                <span className={styles.elegirStatNum} data-target="1000" data-suffix="+">0</span>
                <span className={styles.elegirStatLabel}>{locale === 'en' ? 'LLCs opened' : 'LLCs abiertas'}</span>
              </div>
              <div className={`${styles.elegirStatSep} ${styles.statHideMobile}`} aria-hidden="true" />
              <div className={`${styles.elegirStat} ${styles.statHideMobile}`}>
                <span className={styles.elegirStatNum} data-target="600" data-suffix="+">0</span>
                <span className={styles.elegirStatLabel}>{locale === 'en' ? 'Bank accounts' : 'Cuentas bancarias'}</span>
              </div>
              <div className={`${styles.elegirStatSep} ${styles.statHideMobile}`} aria-hidden="true" />
              <div className={`${styles.elegirStat} ${styles.statHideMobile}`}>
                <span className={styles.elegirStatNum} data-target="800" data-suffix="+">0</span>
                <span className={styles.elegirStatLabel}>{locale === 'en' ? 'Active clients' : 'Clientes activos'}</span>
              </div>
              <div className={styles.elegirStatSep} aria-hidden="true" />
              <div className={styles.elegirStat}>
                <span className={`${styles.elegirStatNum} ${styles.elegirStatNumGreen}`} data-target="4.9" data-suffix="★">0</span>
                <span className={`${styles.elegirStatLabel} ${styles.elegirStatLabelGreen}`}>Trustpilot</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
        {/* Platform block */}
        <div className={styles.elegirPlatWrap}>
          <div className="container">
            <div className={styles.elegirPlataforma}>
              {/* Left copy */}
              <ScrollReveal className={styles.elegirPlatCopy}>
                <span className={styles.elegirPlatLabel}>{locale === 'en' ? 'The platform' : 'La plataforma'}</span>
                <h2 className={styles.elegirPlatTitle}>{locale === 'en' ? <>We don&apos;t stop at formation,<br /><span className={styles.gradText}>we help you operate</span></> : <>No nos quedamos en la apertura,<br /><span className={styles.gradText}>te ayudamos a operar</span></>}</h2>
                <ScrollReveal effect="fade-up" stagger={0.08} className={styles.elegirFeatures}>
                  {[
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
                      title: locale === 'en' ? 'LLC formed with documents' : 'LLC abierta con documentación',
                      sub: locale === 'en' ? 'Articles of Organization, Operating Agreement, and EIN included' : 'Articles of Organization, Operating Agreement y EIN incluidos'
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
                      title: locale === 'en' ? 'Tax filings and compliance' : 'Impuestos y cumplimiento',
                      sub: locale === 'en' ? 'Annual reports, IRS requirements, and deadline alerts' : 'Annual reports, obligaciones IRS y alertas de vencimiento'
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
                      title: locale === 'en' ? 'Professional invoicing in USD' : 'Facturación profesional en USD',
                      sub: locale === 'en' ? 'Create, send, and track invoices from your dashboard' : 'Creá, enviá y seguí facturas desde tu panel'
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
                      title: locale === 'en' ? 'AI Accounting and P&L' : 'Contabilidad IA y P&L',
                      sub: locale === 'en' ? 'Profit and loss visibility updated from your operation' : 'Visibilidad de ganancias y pérdidas actualizada desde tu operación'
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
                      title: locale === 'en' ? 'Legal library and templates' : 'Biblioteca legal y plantillas',
                      sub: locale === 'en' ? 'Contracts and documents prepared for everyday use' : 'Contratos y documentos preparados para el uso diario'
                    }
                  ].map(({ icon, title, sub }) => (
                    <div key={title} className={styles.elegirFeat}>
                      <div className={styles.elegirFeatIcon}>{icon}</div>
                      <div>
                        <div className={styles.elegirFeatTitle}>{title}</div>
                        <div className={styles.elegirFeatSub}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </ScrollReveal>
                <div className={styles.elegirBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {locale === 'en' ? '3 months included · Then $25 USD/mo' : '3 meses incluidos · Luego $25 USD/mes'}
                </div>
                <div className={styles.elegirPlatActions}>
                  <Link href={locale === 'en' ? '/en#precios' : '/#precios'} className="btn btn-primary">
                    {locale === 'en' ? 'See all plans' : 'Ver todos los planes'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href={locale === 'en' ? '/en#por-que-elegirnos' : '/#por-que-elegirnos'} className="btn btn-ghost">
                    {locale === 'en' ? 'Learn more' : 'Saber más'}
                  </Link>
                </div>
              </ScrollReveal>
              {/* Right — coded browser mockup */}
              <ScrollReveal effect="slide-left" className={styles.elegirPlatVisual}>
                <div className={styles.platMockup} aria-hidden="true">
                  <div className={styles.platMockupBar}>
                    <div className={styles.platMockupDots}>
                      <span className={styles.platMockupDot} />
                      <span className={styles.platMockupDot} />
                      <span className={styles.platMockupDot} />
                    </div>
                    <div className={styles.platMockupUrl}>app.llcargentina.io/dashboard</div>
                  </div>
                  <div className={styles.platMockupBody}>
                    <aside className={styles.platMockupSide}>
                      <div className={styles.platMockupBrand}>
                        <span className={styles.platMockupBrandLogo} />
                        <span className={styles.platMockupBrandName}>LLC</span>
                      </div>
                      <div className={styles.platMockupSectionLabel}>{locale === 'en' ? 'General' : 'General'}</div>
                      <ul className={styles.platMockupNav}>
                        <li className={styles.platMockupNavActive}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                          Dashboard
                        </li>
                        <li>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                          Solicitudes <span className={styles.platMockupNavBadge}>2</span>
                        </li>
                        <li>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                          Facturación
                        </li>
                        <li>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                          Contabilidad
                        </li>
                      </ul>
                      <div className={styles.platMockupSectionLabel}>Recursos</div>
                      <ul className={styles.platMockupNav}>
                        <li>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                          Documentos
                        </li>
                        <li>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                          Videos
                        </li>
                        <li>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                          {locale === 'en' ? 'LLC Guides' : 'Guías LLC'}
                        </li>
                      </ul>
                      <div className={styles.platMockupUser}>
                        <div className={styles.platMockupUserAvatar}>CR</div>
                        <div>
                          <div className={styles.platMockupUserName}>Carlos R.</div>
                          <div className={styles.platMockupUserPlan}>Plan Élite</div>
                        </div>
                      </div>
                    </aside>
                    <div className={styles.platMockupMain}>
                      <div className={styles.platMockupTopbar}>
                        <div>
                          <div className={styles.platMockupGreet}>Hola, Carlos 👋</div>
                          <div className={styles.platMockupDate}>Miércoles, 30 de abril 2026</div>
                        </div>
                        <div className={styles.platMockupBell}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                        </div>
                      </div>
                      <div className={styles.platMockupKpis}>
                        <div className={styles.platMockupKpi}>
                          <div className={styles.platMockupKpiLabel}>Account Balance</div>
                          <div className={styles.platMockupKpiValue}>$12,480</div>
                          <div className={styles.platMockupKpiTrend}>▲ 2.5% mes</div>
                        </div>
                        <div className={styles.platMockupKpi}>
                          <div className={styles.platMockupKpiLabel}>Monthly P&amp;L</div>
                          <div className={styles.platMockupKpiValue}>$8,950</div>
                          <div className={styles.platMockupKpiBars}>
                            <div className={styles.platMockupKpiBar} style={{ height: '30%' }} />
                            <div className={styles.platMockupKpiBar} style={{ height: '55%' }} />
                            <div className={styles.platMockupKpiBar} style={{ height: '42%' }} />
                            <div className={styles.platMockupKpiBar} style={{ height: '70%' }} />
                            <div className={styles.platMockupKpiBar} style={{ height: '60%' }} />
                            <div className={`${styles.platMockupKpiBar} ${styles.hi}`} style={{ height: '95%' }} />
                          </div>
                        </div>
                        <div className={styles.platMockupKpi}>
                          <div className={styles.platMockupKpiLabel}>Pending Invoices</div>
                          <div className={styles.platMockupKpiValue}>$3,875</div>
                          <div className={`${styles.platMockupKpiTrend} ${styles.bad}`}>2 facturas</div>
                        </div>
                      </div>
                      <div className={styles.platMockupTable}>
                        <div className={styles.platMockupTableHead}>
                          <span className={styles.platMockupTableTitle}>Actividad reciente</span>
                          <span className={styles.platMockupTableLink}>Ver todo →</span>
                        </div>
                        <div className={styles.platMockupRow}>
                          <div className={`${styles.platMockupRowIcon} ${styles.amber}`}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                          </div>
                          <div className={styles.platMockupRowInfo}>
                            <div className={styles.platMockupRowName}>Reporte WY</div>
                            <div className={styles.platMockupRowSub}>Annual Report · Wyoming</div>
                          </div>
                          <span className={`${styles.platMockupRowTag} ${styles.tagPending}`}>Pendiente</span>
                        </div>
                        <div className={styles.platMockupRow}>
                          <div className={`${styles.platMockupRowIcon} ${styles.blue}`}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                          </div>
                          <div className={styles.platMockupRowInfo}>
                            <div className={styles.platMockupRowName}>Declaración anual</div>
                            <div className={styles.platMockupRowSub}>IRS Form 5472 · vence en 30 días</div>
                          </div>
                          <span className={`${styles.platMockupRowTag} ${styles.tagIn}`}>En curso</span>
                        </div>
                        <div className={styles.platMockupRow}>
                          <div className={`${styles.platMockupRowIcon} ${styles.green}`}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          </div>
                          <div className={styles.platMockupRowInfo}>
                            <div className={styles.platMockupRowName}>Invoice #INV-0042</div>
                            <div className={styles.platMockupRowSub}>Acme Corp · +$2,500</div>
                          </div>
                          <span className={`${styles.platMockupRowTag} ${styles.tagPaid}`}>Pagada</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section className={styles.preciosSec} id="precios">
        <div className="container">
          <ScrollReveal className={styles.preciosHeader}>
            <h2 className={styles.preciosTitle}>{locale === 'en' ? <>Plans from <span className={styles.gradText}>$599 USD</span></> : <>Planes desde <span className={styles.gradText}>$599 USD</span></>}</h2>
            <p className={styles.preciosSub}>{locale === 'en' ? 'Clear pricing, defined scope, and options for formation, banking, taxes, and renewals.' : 'Precios claros, alcance definido y opciones para apertura, banco, impuestos y renovaciones.'}</p>
          </ScrollReveal>
          <ScrollReveal effect="scale-up" stagger={0.12} className={styles.preciosGrid}>
            {/* Pack Emprendedor */}
            <div className={`${styles.precioCard} ${styles.precioCardPopular}`}>
              <div className={styles.precioPopularBadge}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                {locale === 'en' ? 'Client favorite' : 'El más elegido'}
              </div>
              <div className={styles.precioPlan}>{locale === 'en' ? 'Entrepreneur Pack' : 'Pack Emprendedor'}</div>
              <div className={styles.precioPrice}>
                <span className={styles.precioCurrency}>$</span>
                <span className={styles.precioNum}>599</span>
                <span className={styles.precioUsd}>USD</span>
              </div>
              <p className={styles.precioDesc}>{locale === 'en' ? 'For entrepreneurs who need a clean U.S. setup to start operating.' : 'Para emprendedores que necesitan una estructura clara para empezar a operar en EE.UU.'}</p>
              <div className={styles.precioDivider} />
              <ul className={styles.precioFeatures}>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <strong>{locale === 'en' ? 'U.S. LLC' : 'LLC en EE.UU.'}</strong>
                </li>
                <li className={styles.precioSublist}>Wyoming · Delaware · Montana · Florida · New Mexico</li>
                <li className={styles.precioSublist}>{locale === 'en' ? 'Other states: ask our team' : 'Otros estados: consultá con el equipo'}</li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Banking support — Relay, Mercury or Lili Bank' : 'Acompañamiento bancario - Relay, Mercury o Lili Bank'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'EIN (Tax ID) included' : 'EIN (Tax ID) incluido'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Articles of Organization + Operating Agreement' : 'Artículos de organización + Operating Agreement'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <strong>Registered Agent</strong>{' '}{locale === 'en' ? '(U.S. Address)' : '(Dirección USA)'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Assistance with Stripe and sales systems' : 'Asistencia con Stripe y sistemas de venta'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Guidance on LLC obligations' : 'Orientación sobre obligaciones LLC'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <strong>{locale === 'en' ? 'Digital platform' : 'Plataforma digital'}</strong>
                  {' '}<span className={styles.precioFreeBadge}>{locale === 'en' ? '3 months free' : '3 meses gratis'}</span>
                </li>
                <li className={styles.precioSublist}>{locale === 'en' ? 'AI Accounting · USD Invoicing · Legal library' : 'Contabilidad IA · Facturación USD · Biblioteca legal'}</li>
                <li className={styles.precioSublist}>{locale === 'en' ? 'Then $25 USD/mo · cancel anytime' : 'Luego $25 USD/mes · cancelación flexible'}</li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? '24/7 Support' : 'Soporte 24/7'}
                </li>
              </ul>
              <div className={styles.precioCtas}>
                <Link href={consultationHref} className={`btn btn-llamada ${styles.precioCta}`}>{locale === 'en' ? 'Book a call' : 'Reservar llamada'}</Link>
                <Link href={wizardHref} className={`btn btn-comenzar ${styles.precioCta}`}>{locale === 'en' ? 'Create my LLC →' : 'Crear mi LLC →'}</Link>
              </div>
              <div className={`${styles.precioDays} ${styles.precioDaysHighlight}`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {' '}{locale === 'en' ? 'in 7 business days' : 'en 7 días hábiles'}
              </div>
            </div>
            {/* Pack Elite */}
            <div className={styles.precioCard}>
              <div className={styles.precioPopularBadge} style={{ background: '#006AFE' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 11.5L11.5 14L17 8.5L18.5 10L11.5 17L7.5 13L9 11.5z" /></svg>
                {locale === 'en' ? 'Recommended' : 'Recomendado'}
              </div>
              <div className={styles.precioPlan}>{locale === 'en' ? 'Elite Pack' : 'Pack Elite'}</div>
              <div className={styles.precioPrice}>
                <span className={styles.precioCurrency}>$</span>
                <span className={styles.precioNum}>850</span>
                <span className={styles.precioUsd}>USD</span>
              </div>
              <p className={styles.precioDesc}>{locale === 'en' ? 'For operations that need more flexibility, any state, and one year of platform access included.' : 'Para operaciones que necesitan más flexibilidad, cualquier estado y un año de plataforma incluido.'}</p>
              <div className={styles.precioDivider} />
              <ul className={styles.precioFeatures}>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Everything from the Entrepreneur Pack' : 'Todo lo del Pack Emprendedor'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <strong>{locale === 'en' ? 'Single or Multi-member LLC any state' : 'LLC Single o Multimember cualquier estado'}</strong>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <strong>Registered Agent</strong>{' '}{locale === 'en' ? '(U.S. Address)' : '(Dirección USA)'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <strong>{locale === 'en' ? 'Full Platform' : 'Plataforma Integral'}</strong>
                  {' '}<span className={styles.precioFreeBadge}>{locale === 'en' ? '1 year included' : '1 año incluido'}</span>
                </li>
                <li className={styles.precioSublist}>{locale === 'en' ? 'USD Invoicing · AI Accounting · Legal library' : 'Facturación USD · Contabilidad IA · Biblioteca legal'}</li>
                <li className={styles.precioSublist}>{locale === 'en' ? 'No monthly fees in the first year' : 'Sin pagos mensuales el primer año'}</li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Custom LLC Roadmap + reminders' : 'Roadmap LLC personalizado + recordatorios'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Guidance on your LLC structure' : 'Orientación sobre tu estructura LLC'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Priority 24/7 support' : 'Soporte prioritario 24/7'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {locale === 'en' ? 'USDC account for global payments' : 'Cuenta USDC para pagos globales'}
                  {' '}<span className={styles.badgeSoon}>{locale === 'en' ? 'Soon' : 'Próx.'}</span>
                </li>
              </ul>
              <div className={styles.precioCtas}>
                <Link href={consultationHref} className={`btn btn-llamada ${styles.precioCta}`}>{locale === 'en' ? 'Book a call' : 'Reservar llamada'}</Link>
                <Link href={locale === 'en' ? '/en#precios' : '/#precios'} className={`btn btn-comenzar ${styles.precioCta}`}>{locale === 'en' ? 'View full details →' : 'Ver más detalles →'}</Link>
              </div>
              <div className={`${styles.precioDays} ${styles.precioDaysHighlight}`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {' '}{locale === 'en' ? '7 to 15 business days' : '7 a 15 días hábiles'}
              </div>
            </div>
            {/* Pack Premium */}
            <div className={`${styles.precioCard} ${styles.precioCardGold}`}>
              <div className={styles.precioMostPopularBadge}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                {locale === 'en' ? 'Most popular' : 'Más popular'}
              </div>
              <div className={styles.precioPlan}>{locale === 'en' ? 'Premium Pack' : 'Pack Premium'}</div>
              <div className={styles.precioPrice}>
                <span className={styles.precioCurrency}>$</span>
                <span className={styles.precioNum}>1,450</span>
                <span className={styles.precioUsd}>USD</span>
              </div>
              <p className={styles.precioDesc}>{locale === 'en' ? 'A complete annual package: LLC, informational filing preparation, state fees, platform access, and dedicated account manager.' : 'Un paquete anual completo: LLC, preparación declarativa, fees estatales, plataforma y account manager dedicado.'}</p>
              <div className={styles.precioDivider} />
              <ul className={styles.precioFeatures}>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Everything from the Elite Pack' : 'Todo lo del Pack Elite'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'U.S. LLC in any state' : 'LLC en EE.UU. en cualquier estado'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <strong>{locale === 'en' ? 'Complete platform' : 'Plataforma completa'}</strong>
                  {' '}<span className={styles.precioFreeBadge}>{locale === 'en' ? '2 years included' : '2 años incluidos'}</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'Automatic annual renewal included' : 'Renovación anual automática incluida'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? <><strong>Annual federal filing</strong>{' (1120+5472 or 1065)'}</> : <><strong>Declaración federal anual</strong>{' (1120+5472 o 1065)'}</>}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? 'We pay the annual state fee for you' : 'Pagamos el fee anual del estado por vos'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  {locale === 'en' ? '60-minute tax advisory' : 'Asesoría tributaria 60 min'}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <strong>Dedicated Account Manager</strong>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  {locale === 'en' ? 'USDC account for global payments' : 'Cuenta USDC para pagos globales'}
                  {' '}<span className={styles.badgeSoon}>{locale === 'en' ? 'Soon' : 'Próx.'}</span>
                </li>
              </ul>
              <div className={styles.precioCtas}>
                <Link href={consultationHref} className={`btn btn-llamada ${styles.precioCta}`}>{locale === 'en' ? 'Book a call' : 'Reservar llamada'}</Link>
                <Link href={locale === 'en' ? '/en#precios' : '/#precios'} className={`btn btn-comenzar ${styles.precioCta}`}>{locale === 'en' ? 'View details →' : 'Ver detalles →'}</Link>
              </div>
              <div className={`${styles.precioDays} ${styles.precioDaysHighlight}`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {' '}{locale === 'en' ? 'in 7 business days' : 'en 7 días hábiles'}
              </div>
            </div>
          </ScrollReveal>
          {/* Additional services */}
          <div id="servicios-adicionales">
            <ScrollReveal className={styles.preciosExtras}>
              <div className={styles.preciosExtrasLabel}>{locale === 'en' ? 'Add-on services' : 'Servicios complementarios'}</div>
              <div className={styles.preciosExtrasRow}>
                <div className={styles.precioExtra}>
                  <div className={styles.precioExtraIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <div className={styles.precioExtraInfo}>
                    <div className={styles.precioExtraName}>{locale === 'en' ? 'Bank Account' : 'Cuenta bancaria'}</div>
                    <div className={styles.precioExtraDetail}>{locale === 'en' ? 'Mercury or Relay, without prior LLC' : 'Mercury o Relay, sin LLC previa'}</div>
                  </div>
                  <div className={styles.precioExtraPrice}>$150 <span>USD</span></div>
                </div>
                <div className={styles.precioExtra}>
                  <div className={styles.precioExtraIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                  </div>
                  <div className={styles.precioExtraInfo}>
                    <div className={styles.precioExtraName}>{locale === 'en' ? 'Annual LLC Renewal' : 'Renovación anual LLC'}</div>
                    <div className={styles.precioExtraDetail}>Annual Report + Registered Agent</div>
                  </div>
                  <div className={styles.precioExtraPrice}>$600 <span>USD</span></div>
                </div>
                <div className={styles.precioExtra}>
                  <div className={styles.precioExtraIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01C9E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </div>
                  <div className={styles.precioExtraInfo}>
                    <div className={styles.precioExtraName}>{locale === 'en' ? 'IRS Fines & Penalties' : 'Multas y penalidades IRS'}</div>
                    <div className={styles.precioExtraDetail}>{locale === 'en' ? 'Fine management and resolution' : 'Gestión y resolución de multas'}</div>
                  </div>
                  <div className={styles.precioExtraPrice}>$300 <span>USD + 3%</span></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal className={styles.preciosExtrasCta}>
            <Link href={consultationHref} className="btn btn-llamada btn-lg">{locale === 'en' ? 'Book a call' : 'Reservar llamada'}</Link>
            <Link href={wizardHref} className="btn btn-comenzar btn-lg">{locale === 'en' ? 'Start process' : 'Iniciar proceso'} <ArrowIcon /></Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── RESENAS ── */}
      <section className={styles.resenasSec} id="resenas">
        <div className="container">
          <ScrollReveal className={styles.resenasHeader}>
            <h2 className={styles.resenasTitle}>{locale === 'en' ? 'Client experiences' : 'Experiencias de clientes'}</h2>
            <div className={styles.tpBadgeRow}>
              <img src="/img/trustpilot-white.svg" alt="Trustpilot" className={styles.tpBadgeLogo} width={82} height={20} />
              <img src="/img/trustpilot-stars-5.svg" alt={locale === 'en' ? '5 stars' : '5 estrellas'} className={styles.tpBadgeStars} width={96} height={18} />
              <div className={styles.tpBadgeText}>
                <span className={styles.tpScore}>{locale === 'en' ? 'Excellent' : 'Excelente'}</span>
                <span className={styles.tpCount}>4.9/5 · +1,400 {locale === 'en' ? 'reviews' : 'reseñas'}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
        <div className='container'>
          <ScrollReveal className={`${styles.elegirCarousel} ${styles.elegirCarouselOuter}`} effect="scale-up" stagger={0.12} id="elegirCarousel" role="list">
            {(locale === 'en' ? [
              { name: 'Franco Caputo', country: 'Argentina · CEO Wonder Up', avatar: '/img/avatar-franco.png', text: 'Excellent service. Nacho is one of the most dedicated and honest people I have met in the industry. Finding him was a very fortunate coincidence.' },
              { name: 'José Milani', country: 'Argentina · CEO Ser Optimo', avatar: '/img/avatar-jose.png', text: 'It was simpler than I expected. In less than two weeks my LLC was active and the bank account was ready to operate from Argentina.' },
              { name: 'Matias Bottero', country: 'Entre Suculentas · Youtuber', avatar: '/img/avatar-matias.png', text: 'I needed to organize YouTube collections and collaborator payments. With the LLC, the company and bank account were ready quickly.' },
              { name: 'Mateo Sanchez', country: 'Entrepreneur', avatar: '/img/avatar-mateo.png', text: 'Solid quality and fast support. Every time I needed something, the team replied quickly. Completely recommended.' },
              { name: 'Gaston Gallardo', country: 'Entrepreneur', avatar: '/img/avatar-gaston.png', text: 'They delivered what they promised, in the expected time and with a clear process. Highly recommended.' },
              { name: 'Martin Poblet', country: 'Entrepreneur', avatar: '/img/avatar-martin.png', text: 'A very professional team. The process was quick, organized, and easy to follow from start to finish.' }
            ] : [
              { name: 'Franco Caputo', country: 'Argentina · CEO Wonder Up', avatar: '/img/avatar-franco.png', text: 'Excelente servicio. Nacho es una de las personas más trabajadoras y honestas que conocí en el rubro. Haberlo encontrado fue una gran coincidencia.' },
              { name: 'José Milani', country: 'Argentina · CEO Ser Optimo', avatar: '/img/avatar-jose.png', text: 'Fue más simple de lo que imaginaba. En menos de dos semanas tenía la LLC activa y la cuenta bancaria lista para operar desde Argentina.' },
              { name: 'Matias Bottero', country: 'Entre Suculentas · Youtuber', avatar: '/img/avatar-matias.png', text: 'Necesitaba ordenar cobros de YouTube y pagos a colaboradores. Con la LLC, la empresa y la cuenta bancaria quedaron listas rápidamente.' },
              { name: 'Mateo Sanchez', country: 'Emprendedor', avatar: '/img/avatar-mateo.png', text: 'Muy buena calidad y atención rápida. Cada vez que necesitás algo, el equipo responde con claridad. 100% recomendable.' },
              { name: 'Gaston Gallardo', country: 'Emprendedor', avatar: '/img/avatar-gaston.png', text: 'Cumplieron lo prometido, en los tiempos esperados y con un proceso claro. Muy recomendable.' },
              { name: 'Martin Poblet', country: 'Emprendedor', avatar: '/img/avatar-martin.png', text: 'Un equipo muy profesional. El proceso fue rápido, ordenado y fácil de seguir de principio a fin.' }
            ]).map(({ name, country, avatar, text }: { name: string; country: string; avatar: string; text: string }) => (
              <div key={name} className={styles.elegirReviewCard} role="listitem" data-anim="elegirReviewCard">
                <div className={styles.cardTopRow}>
                  <img src="/img/trustpilot-stars-5.svg" alt="5 stars" className={styles.cardTpStars} width={85} height={16} aria-hidden="true" />
                  <img src="/img/trustpilot-white.svg" alt="Trustpilot" className={styles.cardTpWatermark} width={58} height={14} aria-hidden="true" />
                </div>
                <p className={styles.reviewText}>{text}</p>
                <div className={styles.reviewAuthor}>
                  <Image src={avatar} alt={name} className={styles.reviewAvatar} width={40} height={40} loading="lazy" />
                  <div>
                    <div className={styles.reviewName}>
                      {name}
                    </div>
                    <div className={styles.reviewCountry}>{country}</div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── BLOG ── */}
      {recentPosts.length > 0 && (
        <section className={styles.blogSec} id="blog">
          <div className="container">
            <ScrollReveal className={styles.blogHeader}>
              <h2 className={styles.blogTitle}>{locale === 'en' ? 'Keep learning before you decide' : 'Seguí aprendiendo antes de decidir'}</h2>
              <p className={styles.blogSub}>{locale === 'en' ? 'Practical guides and resources for Latin American entrepreneurs building with a U.S. company.' : 'Guías prácticas y recursos para emprendedores de LATAM que operan con una empresa en EE.UU.'}</p>
            </ScrollReveal>
            <ScrollReveal effect="scale-up" stagger={0.1} className={styles.blogGrid}>
              {recentPosts.slice(0, 3).map((post) => (
                <Link key={post.slug ?? post.title} href={post.href ?? `/blog/${post.slug}`} className={styles.blogCard}>
                  <Image src={post.imageSrc} alt={post.imageAlt} className={styles.blogCardImg} width={400} height={220} loading="lazy" />
                  <div className={styles.blogCardBody}>
                    <span className={styles.blogCardTag}>{post.category}</span>
                    <h3 className={styles.blogCardTitle}>{post.title}</h3>
                    <p className={styles.blogCardExcerpt}>{post.meta}</p>
                    <div className={styles.blogCardMeta}>
                      <span className={styles.blogCardRead}>{locale === 'en' ? 'Read' : 'Leer'} <ArrowIcon /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </ScrollReveal>
            <ScrollReveal className={styles.blogCta}>
              <Link href="/blog" className="btn btn-llamada">{locale === 'en' ? 'View all articles' : 'Ver todos los artículos'} <ArrowIcon /></Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className={`${styles.faqSec}`} id="faq">
        <div className={styles.faqGlow1} aria-hidden="true" />
        <div className={styles.faqGlow2} aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal className={styles.faqHeader}>
            <h2 className={styles.faqTitle}>{locale === 'en' ? 'Common questions, clear answers' : 'Preguntas frecuentes, respuestas claras'}</h2>
            <p className={styles.faqSub}>{locale === 'en' ? 'Review the key points before opening and operating your LLC.' : 'Revisá los puntos clave antes de abrir y operar tu LLC.'}</p>
          </ScrollReveal>
          <ScrollReveal effect="fade-up" stagger={0.06} className={styles.faqList}>
            {(locale === 'en' ? [
              {
                q: 'Do I need U.S. citizenship to open an LLC?',
                a: 'No. Anyone over 18 can open a U.S. LLC, regardless of nationality or residency. You do not need a visa, U.S. passport, or physical presence.',
                cta: { text: 'Start process', href: wizardHref }
              },
              {
                q: 'How long does the full process take?',
                a: 'The full process, including LLC approval, EIN, and banking support, usually takes 5 to 7 business days. You can track each step from your dashboard.',
                cta: { text: 'Book a call', href: consultationHref }
              },
              {
                q: 'What is an EIN and what is it for?',
                a: 'The EIN is your company tax identification number with the IRS. You need it for banking, corporate clients, and tax filings. It is included in all our plans.',
                cta: { text: 'Start process', href: wizardHref }
              },
              {
                q: 'Can I open a bank account without traveling to the U.S.?',
                a: 'Yes. Mercury, Relay, and other providers allow online banking applications for non-resident LLCs. We guide the process without requiring you to travel.',
                cta: { text: 'Book a call', href: consultationHref }
              },
              {
                q: 'What taxes do I have to pay as a non-resident?',
                a: 'A single-member LLC owned by a non-resident may not owe U.S. federal income tax when income comes from activity outside the country, but filing obligations still apply. We review your case.',
                cta: { text: 'Start process', href: wizardHref }
              },
              {
                q: 'What does the management dashboard include?',
                a: 'The dashboard includes USD invoicing, AI accounting, P&L visibility, legal templates, LLC videos, company roadmap, and compliance reminders. The first 3 months are included.',
                cta: { text: 'Book a call', href: consultationHref }
              },
              {
                q: 'What happens if I don\'t renew my LLC on time?',
                a: 'If you miss renewals, the state can mark the company inactive or dissolve it, which can affect your bank account and operations. Our renewal service keeps the Annual Report and Registered Agent covered.',
                cta: { text: 'Start process', href: renewHref }
              }
            ] : [
              {
                q: '¿Necesito ciudadanía estadounidense para abrir una LLC?',
                a: 'No. Cualquier persona mayor de 18 años puede abrir una LLC en EE.UU., sin importar su nacionalidad o residencia. No necesitás visa, pasaporte americano ni presencia física.',
                cta: { text: 'Iniciar proceso', href: wizardHref }
              },
              {
                q: '¿Cuánto tiempo tarda el proceso completo?',
                a: 'El proceso completo, incluyendo LLC aprobada, EIN y acompañamiento bancario, suele tomar entre 5 y 7 días hábiles. Podés seguir cada etapa desde tu panel.',
                cta: { text: 'Reservar llamada', href: consultationHref }
              },
              {
                q: '¿Qué es el EIN y para qué sirve?',
                a: 'El EIN es el número de identificación fiscal de tu empresa ante el IRS. Lo necesitás para bancos, clientes corporativos y declaraciones fiscales. Está incluido en todos los planes.',
                cta: { text: 'Iniciar proceso', href: wizardHref }
              },
              {
                q: '¿Puedo abrir una cuenta bancaria sin viajar a EE.UU.?',
                a: 'Sí. Mercury, Relay y otros proveedores permiten solicitudes bancarias online para LLCs de no residentes. Te guiamos sin que tengas que viajar.',
                cta: { text: 'Reservar llamada', href: consultationHref }
              },
              {
                q: '¿Qué impuestos debo pagar como no residente?',
                a: 'Una LLC de un solo miembro y dueño no residente puede no pagar impuesto federal sobre ingresos generados fuera de EE.UU., pero igual existen obligaciones informativas. Revisamos tu caso.',
                cta: { text: 'Iniciar proceso', href: wizardHref }
              },
              {
                q: '¿Qué incluye el panel de gestión?',
                a: 'El panel incluye facturación USD, contabilidad IA, visibilidad de P&L, plantillas legales, videos sobre LLCs, roadmap de empresa y recordatorios de cumplimiento. Los primeros 3 meses están incluidos.',
                cta: { text: 'Reservar llamada', href: consultationHref }
              },
              {
                q: '¿Qué pasa si no renuevo mi LLC a tiempo?',
                a: 'Si no renovás a tiempo, el estado puede marcar la empresa como inactiva o disolverla, afectando banco y operación. Nuestro servicio cubre Annual Report y Registered Agent.',
                cta: { text: 'Renovar LLC', href: renewHref }
              }
            ]).map(({ q, a, cta }) => (
              <div key={q} className={styles.faqItem}>
                <button type="button" className={`${styles.faqQ}`} aria-expanded="false" data-anim="faqQ">
                  {q}
                  <svg className={styles.faqChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className={`${styles.faqA}`} data-anim="faqA">
                  <div className={styles.faqAInner}>
                    {a}
                    {' '}<Link href={cta.href} className={styles.faqCtaLink}>{cta.text} <ArrowIcon /></Link>
                  </div>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className={styles.ctaFinal} id="cta-final">
        <canvas className={styles.ctaCanvas} id="ctaCanvas" aria-hidden="true" />
        <ScrollReveal className={`container ${styles.ctaFinalInner}`}>
          <div className={styles.ctaFinalTp}>
            <div className={styles.ctaFinalTpStars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#00b67a" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className={styles.ctaFinalTpText}>{locale === 'en' ? <>4.9/5 on <span className="tp-green">Trustpilot</span> · +250 verified reviews</> : <>4.9/5 en <span className="tp-green">Trustpilot</span> · +250 reseñas verificadas</>}</span>
          </div>
          <h2 className={styles.ctaFinalTitle}>{locale === 'en' ? <>Start today.<br />Build from a U.S. company.</> : <>Empezá hoy.<br />Operá con tu empresa en EE.UU.</>}</h2>
          <p className={styles.ctaFinalSub}>{locale === 'en' ? 'More than 1,400 entrepreneurs already use a U.S. structure to operate globally.' : 'Más de 1,400 emprendedores ya usan una estructura estadounidense para operar globalmente.'}</p>
          <div className={styles.ctaFinalActions}>
            <Link href={consultationHref} className="btn btn-llamada btn-lg">
              {locale === 'en' ? 'Book free call' : 'Reservar llamada gratuita'}{' '}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href={wizardHref} className="btn btn-comenzar btn-lg">{locale === 'en' ? 'Open my LLC' : 'Iniciar proceso'} <ArrowIcon /></Link>
          </div>
        </ScrollReveal>
      </section>

      <SiteFooter />
      <WhatsAppFloatButton />
      <HomeInteractiveShell />
    </main>
  );
}
