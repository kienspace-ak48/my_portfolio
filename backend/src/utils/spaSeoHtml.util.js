const { escapeHtmlAttr } = require("./seoTemplate.util");

function applySeoPlaceholders(html, meta) {
  const map = {
    __TITLE__: escapeHtmlAttr(meta.title),
    __DESCRIPTION__: escapeHtmlAttr(meta.description),
    __KEYWORDS__: escapeHtmlAttr(meta.keywords),
    __ROBOTS__: escapeHtmlAttr(meta.robots),
    __CANONICAL__: escapeHtmlAttr(meta.canonical),
    __OG_IMAGE__: escapeHtmlAttr(meta.ogImage),
    __OG_IMAGE_SECURE__: escapeHtmlAttr(meta.ogImageSecure || meta.ogImage),
    __OG_IMAGE_TYPE__: escapeHtmlAttr(meta.ogImageType || "image/jpeg"),
    __SITE_NAME__: escapeHtmlAttr(meta.siteName),
    __TWITTER_SITE__: escapeHtmlAttr(meta.twitterSite || ""),
    __THEME_COLOR__: escapeHtmlAttr(meta.themeColor || "#6366f1"),
    __OG_URL__: escapeHtmlAttr(meta.canonical),
    __OG_TITLE__: escapeHtmlAttr(meta.ogTitle || meta.title),
    __OG_DESCRIPTION__: escapeHtmlAttr(meta.ogDescription || meta.description),
    __OG_LOCALE__: escapeHtmlAttr(meta.ogLocale || "vi_VN"),
  };

  let output = html;
  for (const [key, value] of Object.entries(map)) {
    output = output.split(key).join(value);
  }
  return output;
}

module.exports = {
  applySeoPlaceholders,
};
