const PREFIX = 'llcargentina_whatsapp_';
const TRACKING_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'creativeId', 'creative_id', 'creativeld', 'fbclid', 'gclid', 'ttclid'] as const;
type TrackingKey = (typeof TRACKING_KEYS)[number];
type Payload = { ticketId: string; eventId: string; phoneNumber: string; message: string; surface: string; currentUrl: string; currentPath: string; initialUrl: string; initialPath: string; referrer: string; userAgent: string; language: string; timezone: string; tracking: Partial<Record<TrackingKey, string>>; fbc: string; fbp: string };

function getSession(key: string) { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } }
function setSession(key: string, value: string) { try { sessionStorage.setItem(key, value); } catch { /* Storage can be disabled. */ } }
function cookie(name: string) { const value = document.cookie.split('; ').find((part) => part.startsWith(`${name}=`)); return value ? decodeURIComponent(value.slice(name.length + 1)) : ''; }
function shortId(prefix = '') { const random = crypto?.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0].toString(36) : Math.random().toString(36).slice(2); return `${prefix ? `${prefix}_` : ''}${Date.now().toString(36)}${random.slice(0, 6)}`.toUpperCase(); }
function storedId(key: string, prefix = '') { const existing = getSession(key); if (existing) return existing; const value = shortId(prefix); setSession(key, value); return value; }
function timezone() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; } }

/** Saves the tab's first campaign URL without adding visible site parameters. */
export function rememberWhatsAppAttribution() {
  const url = new URL(location.href);
  if (!getSession(`${PREFIX}initial_url`)) { setSession(`${PREFIX}initial_url`, url.toString()); setSession(`${PREFIX}initial_path`, `${url.pathname}${url.search}`); }
  TRACKING_KEYS.forEach((key) => { const value = url.searchParams.get(key)?.trim(); if (value && !getSession(`${PREFIX}${key}`)) setSession(`${PREFIX}${key}`, value); });
}

/** Keeps CRM correlation in the WhatsApp body but makes no visible copy change. */
export function encodeInvisibleTicket(ticketId: string) {
  const zero = '\u200B'; const one = '\u200C'; const delimiter = '\u200D';
  const binary = Array.from(ticketId).map((char) => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
  return `${zero.repeat(5)}${delimiter}${binary.replace(/0/g, zero).replace(/1/g, one)}${delimiter}`;
}

function parseWhatsAppHref(href: string) {
  try {
    const url = new URL(href); const host = url.hostname.toLowerCase();
    if (!(host === 'wa.me' || host === 'api.whatsapp.com' || host === 'web.whatsapp.com')) return { phoneNumber: '', message: '' };
    const phoneNumber = (url.searchParams.get('phone') || (host === 'wa.me' ? url.pathname.split('/').filter(Boolean).pop() : '') || '').replace(/\D/g, '');
    return { phoneNumber, message: url.searchParams.get('text') || '' };
  } catch { return { phoneNumber: '', message: '' }; }
}

function payload(phoneNumber: string, message: string, surface: string): Payload {
  rememberWhatsAppAttribution(); const url = new URL(location.href);
  const tracking = Object.fromEntries(TRACKING_KEYS.flatMap((key) => { const value = url.searchParams.get(key)?.trim() || getSession(`${PREFIX}${key}`); return value ? [[key, value]] : []; })) as Partial<Record<TrackingKey, string>>;
  return { ticketId: storedId(`${PREFIX}ticket`), eventId: storedId(`${PREFIX}event_id`, 'EVT'), phoneNumber, message, surface, currentUrl: url.toString(), currentPath: `${url.pathname}${url.search}`, initialUrl: getSession(`${PREFIX}initial_url`) || url.toString(), initialPath: getSession(`${PREFIX}initial_path`) || `${url.pathname}${url.search}`, referrer: document.referrer, userAgent: navigator.userAgent, language: navigator.language, timezone: timezone(), tracking, fbc: cookie('_fbc'), fbp: cookie('_fbp') };
}

function report(data: Payload) {
  const body = JSON.stringify(data);
  try { if (navigator.sendBeacon?.('/api/whatsapp-click', new Blob([body], { type: 'application/json' }))) return; } catch { /* Fetch below. */ }
  void fetch('/api/whatsapp-click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => { /* Never affect WhatsApp. */ });
}

/** Reports the click but deliberately leaves the anchor navigation untouched. */
export function initWhatsAppTracking() {
  rememberWhatsAppAttribution();
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    const target = event.target; if (!(target instanceof Element)) return;
    const anchor = target.closest<HTMLAnchorElement>('a[href]'); if (!anchor) return;
    const { phoneNumber, message } = parseWhatsAppHref(anchor.href); if (!phoneNumber) return;
    const visibleMessage = message || anchor.dataset.whatsappMessage || 'Hola, quiero abrir mi LLC desde Argentina [SC:llcargentina]';
    const data = payload(phoneNumber, visibleMessage, anchor.dataset.whatsappSurface || 'direct_whatsapp_link');
    report(data);
  });
}
