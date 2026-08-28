import type { APIRoute } from 'astro';

export const prerender = false;
const DEFAULT_ENDPOINT = 'https://www.zohoapis.com/crm/v7/functions/captura_urls_web/actions/execute';
const MAX_FIELD_LENGTH = 2_000;

function text(value: unknown, maxLength = MAX_FIELD_LENGTH) { return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''; }
function firstHeader(value: string | null) { return value?.split(',')[0]?.trim() || ''; }
function publicUrl(value: unknown) {
  const candidate = text(value); if (!candidate) return '';
  try { const url = new URL(candidate); return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : ''; } catch { return ''; }
}
function tracking(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const record = value as Record<string, unknown>;
  return Object.fromEntries(['utm_campaign', 'utm_term', 'utm_content', 'utm_source', 'utm_medium', 'utm_id', 'creativeId', 'creative_id', 'creativeld', 'fbclid', 'gclid', 'ttclid'].flatMap((key) => {
    const field = text(record[key], 500); return field ? [[key, field]] : [];
  }));
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return new Response(JSON.stringify({ ok: false }), { status: 400 }); }
  const apiKey = process.env.ZOHO_WHATSAPP_CAPTURE_API_KEY?.trim();
  // Do not reveal server configuration, and never make the client wait for Zoho.
  if (!apiKey) return new Response(null, { status: 204 });

  const currentUrl = publicUrl(body.currentUrl);
  const initialUrl = publicUrl(body.initialUrl) || currentUrl;
  const ip = firstHeader(request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for'));
  const countryCode = text(request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country'), 8);
  const params = new URLSearchParams({
    auth_type: 'apikey', zapikey: apiKey,
    id_ticket: text(body.ticketId, 100), _eventld: text(body.eventId, 100),
    url_landing: initialUrl || 'Visita Directa', url_actual: currentUrl, url_anuncio: initialUrl ? initialUrl.split('?')[0] : '',
    pagina_startcompanies: text(body.currentPath, 500), pagina_inicial: text(body.initialPath, 500), referrer: publicUrl(body.referrer),
    surface: text(body.surface, 100), phone_number: text(body.phoneNumber, 30), mensaje_whatsapp: text(body.message, 1_000),
    _fbc: text(body.fbc, 500), _fbp: text(body.fbp, 500), ip, pais_cod: countryCode,
    user_agent: text(body.userAgent, 1_000) || request.headers.get('user-agent') || '', language: text(body.language, 100), timezone: text(body.timezone, 100),
    ...tracking(body.tracking),
  });
  try { await fetch(`${process.env.ZOHO_WHATSAPP_CAPTURE_ENDPOINT?.trim() || DEFAULT_ENDPOINT}?${params}`, { method: 'GET', cache: 'no-store', signal: AbortSignal.timeout(5_000) }); } catch { /* Best effort. */ }
  return new Response(null, { status: 204 });
};
