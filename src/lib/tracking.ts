/**
 * Tracking utilities — wraps fbq (Meta Pixel) and dataLayer (GTM).
 * Safe to call from any client component: guards against SSR and missing globals.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: Record<string, unknown>[];
  }
}

function fbq(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
}

function dataLayer(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
  window.dataLayer.push({ event, ...(params ?? {}) });
}

/** User submitted a lead form or booked a call */
export function trackLead(params?: { content_name?: string; content_category?: string }) {
  fbq('Lead', params);
  dataLayer('lead', params);
}

/** User completed a registration / signup flow */
export function trackCompleteRegistration(params?: { content_name?: string }) {
  fbq('CompleteRegistration', params);
  dataLayer('complete_registration', params);
}

/** Generic custom event (e.g. button clicks, modal opens) */
export function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('trackCustom', eventName, params);
  dataLayer(eventName, params);
}
