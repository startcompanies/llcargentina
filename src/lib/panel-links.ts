/**
 * Central resolver for the customer panel subdomain.
 *
 * Production: https://panel.startcompanies.io
 * Staging:    https://panel-staging.startcompanies.io
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_PANEL_BASE_URL (explicit override, wins if set)
 *   2. Auto-detect staging from NEXT_PUBLIC_SITE_URL (host contains "staging")
 *   3. Production default
 *
 * Uses NEXT_PUBLIC_ vars so the value is inlined at build time and works the
 * same in server and client components (synchronously).
 */
const PANEL_PROD = "https://panel.startcompanies.io";
const PANEL_STAGING = "https://panel-staging.startcompanies.io";
const LEGACY_PANEL_HOSTS = new Set([
  "panel.llcargentina.io",
  "panel-staging.llcargentina.io",
  "panel.llcargentina.com",
  "panel-staging.llcargentina.com",
]);

function normalizePanelBase(value: string): string {
  const trimmed = value.replace(/\/+$/, "");

  try {
    const url = new URL(trimmed);

    if (LEGACY_PANEL_HOSTS.has(url.hostname)) {
      return PANEL_PROD;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

function resolvePanelBase(): string {
  const explicit = process.env.NEXT_PUBLIC_PANEL_BASE_URL?.trim();
  if (explicit) {
    return normalizePanelBase(explicit);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (/staging/i.test(siteUrl)) {
    return PANEL_STAGING;
  }

  return PANEL_PROD;
}

export const PANEL_BASE_URL = resolvePanelBase();

/** Build a panel URL. `panelUrl()` → "<base>/", `panelUrl("apertura-llc")` → "<base>/apertura-llc". */
export function panelUrl(path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${PANEL_BASE_URL}/${clean}` : `${PANEL_BASE_URL}/`;
}
