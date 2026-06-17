import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/config";
import { panelUrl } from "@/lib/panel-links";

export type NavItem = {
  href: string;
  label: string;
  kind?: "route" | "section";
  sectionId?: string;
  activePrefixes?: string[];
  excludePrefixes?: string[];
};

export type MenuAction = {
  id: "panel" | "blog" | "sales";
  href: string;
  label: string;
};

const menuEs = {
  primary: [
    { href: "/", label: "Inicio", kind: "route" },
    {
      href: "/#servicios",
      label: "Servicios",
      kind: "section",
      sectionId: "servicios",
    },
    {
      href: "/blog",
      label: "Blog",
      kind: "route",
      activePrefixes: ["/blog"],
      excludePrefixes: ["/blog-admin"],
    },
  ] satisfies NavItem[],
  desktopActions: {
    panel: { id: "panel" as const, href: panelUrl(), label: "Mi Panel" },
    sales: {
      id: "sales" as const,
      href: panelUrl("apertura-llc"),
      label: "Abrir mi LLC",
    },
  },
  mobileActions: [
    { id: "panel" as const, href: panelUrl(), label: "Mi Panel" },
    { id: "blog" as const, href: "/blog", label: "Blog" },
    {
      id: "sales" as const,
      href: panelUrl("apertura-llc"),
      label: "Abrir mi LLC",
    },
  ] satisfies MenuAction[],
  footer: {
    company: [
      { href: "/", label: "Inicio" },
      { href: "/blog", label: "Blog" },
    ] satisfies NavItem[],
    services: [
      {
        href: panelUrl("apertura-llc"),
        label: "Abrir LLC",
      },
      {
        href: panelUrl("renovar-llc"),
        label: "Renueva tu LLC",
      },
    ] satisfies NavItem[],
    legal: [] satisfies NavItem[],
  },
};

const menuEn = {
  primary: [
    { href: "/en", label: "Home", kind: "route" },
    {
      href: "/en/#servicios",
      label: "Services",
      kind: "section",
      sectionId: "servicios",
    },
    {
      href: "/blog",
      label: "Blog",
      kind: "route",
      activePrefixes: ["/blog"],
      excludePrefixes: ["/blog-admin"],
    },
  ] satisfies NavItem[],
  desktopActions: {
    panel: { id: "panel" as const, href: panelUrl(), label: "My Panel" },
    sales: {
      id: "sales" as const,
      href: panelUrl("en/llc-opening"),
      label: "Open my LLC",
    },
  },
  mobileActions: [
    { id: "panel" as const, href: panelUrl(), label: "My Panel" },
    { id: "blog" as const, href: "/blog", label: "Blog" },
    {
      id: "sales" as const,
      href: panelUrl("en/llc-opening"),
      label: "Open my LLC",
    },
  ] satisfies MenuAction[],
  footer: {
    company: [
      { href: "/en", label: "Home" },
      { href: "/blog", label: "Blog" },
    ] satisfies NavItem[],
    services: [
      {
        href: panelUrl("en/llc-opening"),
        label: "Open LLC",
      },
      {
        href: panelUrl("en/llc-renewal"),
        label: "Renew your LLC",
      },
    ] satisfies NavItem[],
    legal: [] satisfies NavItem[],
  },
};

export function getSiteMenu(locale: Locale) {
  return locale === "en" ? menuEn : menuEs;
}

export function getNavItems(locale: Locale) {
  return getSiteMenu(locale).primary;
}

export function getFooterCompanyLinks(locale: Locale) {
  return getSiteMenu(locale).footer.company;
}

export function getFooterServiceLinks(locale: Locale) {
  return getSiteMenu(locale).footer.services;
}

export function getFooterLegalLinks(locale: Locale) {
  return getSiteMenu(locale).footer.legal;
}

export function getLocaleSwitchHref(
  currentEsPath: string,
  targetLocale: Locale,
): string {
  return getLocalizedPath(currentEsPath, targetLocale);
}

export const siteMenu = menuEs;
export const navItems = menuEs.primary;
export const footerCompanyLinks = menuEs.footer.company;
export const footerServiceLinks = menuEs.footer.services;
export const footerLegalLinks = menuEs.footer.legal;
