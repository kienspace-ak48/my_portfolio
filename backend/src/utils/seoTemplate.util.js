const { buildCanonicalUrl } = require("../config/appUrl.config");

function resolveTemplate(template, vars = {}) {
  if (!template) return "";
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key) => {
    const value = vars[key];
    return value == null ? "" : String(value).trim();
  });
}

function escapeHtmlAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function truncateText(text, max = 160) {
  const value = String(text ?? "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function isAllowedOgImage(url) {
  if (!url) return false;
  return !/\.(avif|webp|svg)(\?|$)/i.test(url);
}

function resolveOgImageUrl({ global, pageTemplate, vars, siteUrl }) {
  const candidates = [
    vars.ogImage,
    pageTemplate?.ogImageUrl,
    global?.ogImageUrl,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (!isAllowedOgImage(candidate)) continue;
    if (/^https?:\/\//i.test(candidate)) return candidate;
    const base = siteUrl?.replace(/\/+$/, "") ?? "";
    return `${base}${candidate.startsWith("/") ? candidate : `/${candidate}`}`;
  }

  return "";
}

function detectOgImageType(url) {
  if (/\.png(\?|$)/i.test(url)) return "image/png";
  if (/\.jpe?g(\?|$)/i.test(url)) return "image/jpeg";
  if (/\.gif(\?|$)/i.test(url)) return "image/gif";
  return "image/jpeg";
}

module.exports = {
  resolveTemplate,
  escapeHtmlAttr,
  truncateText,
  isAllowedOgImage,
  resolveOgImageUrl,
  detectOgImageType,
  buildCanonicalUrl,
};
