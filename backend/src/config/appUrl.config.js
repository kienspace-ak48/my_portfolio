function normalizeBaseUrl(url) {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
}

function getPublicSiteUrl(req) {
  const fromEnv =
    process.env.PUBLIC_SITE_URL || process.env.CLIENT_APP_URL || "";
  if (fromEnv) return normalizeBaseUrl(fromEnv);

  const proto = req.get("x-forwarded-proto") || req.protocol || "http";
  const host = req.get("x-forwarded-host") || req.get("host") || "localhost";
  return normalizeBaseUrl(`${proto}://${host}`);
}

function buildCanonicalUrl(siteUrl, pathname) {
  const base = normalizeBaseUrl(siteUrl);
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path === "/" ? "" : path}` || base;
}

function isLocalDevUrl(url) {
  return /localhost|127\.0\.0\.1|:5173\b/i.test(url || "");
}

module.exports = {
  normalizeBaseUrl,
  getPublicSiteUrl,
  buildCanonicalUrl,
  isLocalDevUrl,
};
