import type { SeoVars } from "./types";

export function resolveTemplate(
  template: string | undefined,
  vars: SeoVars = {},
): string {
  if (!template) return "";
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => {
    const value = vars[key];
    return value == null ? "" : String(value).trim();
  });
}

export function truncateText(text: string, max = 160): string {
  const value = text.trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function isAllowedOgImage(url?: string): boolean {
  if (!url) return false;
  return !/\.(avif|webp|svg)(\?|$)/i.test(url);
}

export function resolveOgImageUrl({
  globalOg,
  pageOg,
  varOg,
  siteUrl,
}: {
  globalOg?: string;
  pageOg?: string | null;
  varOg?: string;
  siteUrl: string;
}): string {
  const candidates = [varOg, pageOg ?? undefined, globalOg].filter(Boolean);

  for (const candidate of candidates) {
    if (!candidate || !isAllowedOgImage(candidate)) continue;
    if (/^https?:\/\//i.test(candidate)) return candidate;
    const base = siteUrl.replace(/\/+$/, "");
    return `${base}${candidate.startsWith("/") ? candidate : `/${candidate}`}`;
  }

  return "";
}

export function buildCanonicalUrl(siteUrl: string, pathname: string): string {
  const base = siteUrl.replace(/\/+$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path === "/" ? "" : path}` || base;
}
