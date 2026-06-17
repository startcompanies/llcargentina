import type { Locale } from "@/i18n/config";
import { panelUrl } from "@/lib/panel-links";

export const whatsAppSalesHref =
  "https://wa.me/17869354213?text=Hola%2C%20quiero%20abrir%20mi%20LLC";
export const primaryConsultationHref = whatsAppSalesHref;

export function getConsultationHref(locale: Locale) {
  return getWhatsAppHref(locale);
}

export function getWhatsAppHref(locale: Locale) {
  return locale === "en"
    ? "https://wa.me/17869354213?text=Hi%2C%20I%20want%20to%20open%20my%20LLC"
    : "https://wa.me/17869354213?text=Hola%2C%20quiero%20abrir%20mi%20LLC";
}

export function getPricingHref(locale: Locale) {
  return locale === "en" ? "/en#precios" : "/#precios";
}

export function getWizardHref(locale: Locale) {
  return locale === "en"
    ? panelUrl("en/llc-opening")
    : panelUrl("apertura-llc");
}

export function getRenewHref(locale: Locale) {
  return locale === "en"
    ? panelUrl("en/llc-renewal")
    : panelUrl("renovar-llc");
}
