'use client';

import { type MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowIcon } from '@/components/common/ArrowIcon/ArrowIcon';
import { BrandLogo } from '@/components/common/BrandLogo/BrandLogo';
import { useLocale } from '@/i18n/LocaleProvider';
import { getNavItems, getSiteMenu, type NavItem } from '@/lib/site-links';
import { enToEsRouteMap, esToEnRouteMap } from '@/i18n/config';
import styles from './SiteHeader.module.css';

type SiteHeaderProps = {
  variant: 'transparent' | 'light-page';
};

function getLanguageSwitchHref(pathname: string, currentLocale: 'es' | 'en'): string {
  if (pathname === '/blog' || pathname.startsWith('/blog/')) {
    return pathname;
  }

  if (currentLocale === 'es') {
    // Switch to English
    if (pathname === '/') return '/en';
    const segment = pathname.slice(1).split('/')[0];
    const enSlug = esToEnRouteMap[segment];
    if (enSlug) return `/en/${enSlug}${pathname.slice(1 + segment.length)}`;
    return `/en${pathname}`;
  }

  // Switch to Spanish — pathname may be the rewritten Spanish path or the original /en/* path
  if (pathname.startsWith('/en')) {
    const rest = pathname.slice(3);
    if (!rest || rest === '/') return '/';
    const segment = rest.slice(1).split('/')[0];
    const esRoute = enToEsRouteMap[segment];
    if (esRoute) return `/${esRoute}${rest.slice(1 + segment.length)}`;
    return rest;
  }
  // Already a Spanish path (rewritten)
  return pathname;
}

export function SiteHeader({ variant }: SiteHeaderProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  const variantClass = variant === 'light-page' ? styles.lightPage : styles.transparent;
  const headerClassName = [styles.navbar, variantClass, isScrolled ? styles.scrolled : ''].filter(Boolean).join(' ');

  const menu = getSiteMenu(locale);
  const items = getNavItems(locale);
  const homeHref = locale === 'en' ? '/en' : '/';

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 40);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    function syncHash() {
      setCurrentHash(window.location.hash);
    }

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => {
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);

  function isActiveLink(item: NavItem) {
    const homePath = locale === 'en' ? '/en' : '/';

    if (item.kind === 'section' && item.sectionId) {
      return pathname === homePath && currentHash === `#${item.sectionId}`;
    }

    if (item.href === homePath) {
      return pathname === homePath && currentHash === '';
    }

    if (pathname === item.href) {
      return true;
    }

    if (item.excludePrefixes?.some((prefix) => pathname.startsWith(prefix))) {
      return false;
    }

    return item.activePrefixes?.some((prefix) => pathname.startsWith(prefix)) === true;
  }

  function closeMobileMenu() {
    setIsMobileOpen(false);
  }

  function handleNavItemClick(event: MouseEvent<HTMLAnchorElement>, item: NavItem) {
    const homePath = locale === 'en' ? '/en' : '/';

    if (item.kind !== 'section' || !item.sectionId) {
      closeMobileMenu();
      return;
    }

    if (pathname !== homePath) {
      closeMobileMenu();
      return;
    }

    event.preventDefault();
    closeMobileMenu();

    const hash = `#${item.sectionId}`;
    const target = document.getElementById(item.sectionId);

    setCurrentHash(hash);
    window.history.replaceState(null, '', `${pathname}${hash}`);

    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function handleLanguageSwitch(targetLocale: 'es' | 'en') {
    if (targetLocale === locale) return;

    // Use window.location.pathname which reflects the actual browser URL
    const browserPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const href = getLanguageSwitchHref(browserPath, locale);

    // Full navigation so middleware sets the correct locale header
    window.location.href = href;
  }

  return (
    <div className={styles.root}>
      <header className={headerClassName} id="navbar">
        <div className="container">
          <nav className={styles.navInner}>
            <Link href={homeHref} className={styles.navLogo} aria-label="LLC Argentina — Home">
              <BrandLogo className={styles.logo} tone={variant === 'light-page' ? 'light' : 'dark'} alt="" priority />
            </Link>

            <ul className={styles.navLinks}>
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isActiveLink(item) ? styles.navLinkActive : styles.navLink}
                    aria-current={isActiveLink(item) ? 'page' : undefined}
                    onClick={(event) => handleNavItemClick(event, item)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.navRight}>
              <Link href={menu.desktopActions.panel.href} className={styles.navPanelBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                {menu.desktopActions.panel.label}
              </Link>
              <Link href={menu.desktopActions.sales.href} className={`${styles.navCta} btn`}>
                {menu.desktopActions.sales.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className={styles.langSwitcher} aria-label={locale === 'en' ? 'Language' : 'Idioma'}>
              <button
                className={locale === 'es' ? styles.langBtnActive : styles.langBtn}
                type="button"
                onClick={() => handleLanguageSwitch('es')}
              >
                ES
              </button>
              <span className={styles.langSep}>|</span>
              <button
                className={locale === 'en' ? styles.langBtnActive : styles.langBtn}
                type="button"
                onClick={() => handleLanguageSwitch('en')}
              >
                EN
              </button>
            </div>

            <button
              className={isMobileOpen ? styles.navHamburgerOpen : styles.navHamburger}
              id="nav-hamburger"
              aria-label={locale === 'en' ? 'Open menu' : 'Abrir menú'}
              aria-expanded={isMobileOpen}
              aria-controls="nav-mobile"
              type="button"
              onClick={() => setIsMobileOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          </nav>
        </div>
      </header>

      <div
        className={isMobileOpen ? styles.navMobileOpen : styles.navMobile}
        id="nav-mobile"
        role="navigation"
        aria-label={locale === 'en' ? 'Mobile menu' : 'Menú móvil'}
        aria-hidden={!isMobileOpen}
      >
        <ul className={styles.navMobileLinks}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActiveLink(item) ? styles.navMobileLinkActive : styles.navMobileLink}
                aria-current={isActiveLink(item) ? 'page' : undefined}
                onClick={(event) => handleNavItemClick(event, item)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.navMobileActions}>
          <Link href={menu.mobileActions[0].href} className="btn btn-ghost" onClick={closeMobileMenu}>
            {menu.mobileActions[0].label}
          </Link>
          <Link
            href={menu.mobileActions[1].href}
            className={`btn ${styles.mobileActionPrimary}`}
            onClick={closeMobileMenu}
          >
            {menu.mobileActions[1].label}
          </Link>
          <Link
            href={menu.mobileActions[2].href}
            className={`btn ${styles.mobileActionSales}`}
            onClick={closeMobileMenu}
          >
            {menu.mobileActions[2].label} <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
