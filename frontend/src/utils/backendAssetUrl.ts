const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

/** Resolve /uploads/... paths against backend origin (strip trailing /api). */
export function resolveBackendAssetUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const origin = API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
}
