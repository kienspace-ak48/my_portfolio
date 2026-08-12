const MAX_BODY_BYTES = 512 * 1024;
const FETCH_TIMEOUT_MS = 12_000;

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
]);

function decodeHtmlEntities(value = "") {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));
}

function isPrivateIp(hostname) {
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
  if (/^169\.254\./.test(hostname)) return true;
  if (/^127\./.test(hostname)) return true;
  if (/^0\./.test(hostname)) return true;
  return false;
}

function normalizeUrl(rawUrl) {
  const trimmed = String(rawUrl ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function assertSafeUrl(rawUrl) {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized) {
    throw new Error("URL không hợp lệ");
  }

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error("URL không hợp lệ");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Chỉ hỗ trợ URL http hoặc https");
  }

  const host = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host) || isPrivateIp(host) || host.endsWith(".local")) {
    throw new Error("Không được crawl URL nội bộ hoặc localhost");
  }

  return parsed;
}

function matchFirst(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1].trim());
    }
  }
  return "";
}

function getMetaByName(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return matchFirst(html, [
    new RegExp(
      `<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${escaped}["']`,
      "i",
    ),
  ]);
}

function getMetaByProperty(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return matchFirst(html, [
    new RegExp(
      `<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${escaped}["']`,
      "i",
    ),
  ]);
}

function getTitle(html) {
  return matchFirst(html, [/<title[^>]*>([^<]*)<\/title>/i]);
}

function getLinkHref(html, rel) {
  const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return matchFirst(html, [
    new RegExp(
      `<link[^>]+rel=["']${escaped}["'][^>]+href=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<link[^>]+href=["']([^"']*)["'][^>]+rel=["']${escaped}["']`,
      "i",
    ),
  ]);
}

function resolveUrl(baseUrl, maybeRelative) {
  if (!maybeRelative?.trim()) return "";
  try {
    return new URL(maybeRelative.trim(), baseUrl).href;
  } catch {
    return maybeRelative.trim();
  }
}

function extractHead(html) {
  const match = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return match ? match[1] : html.slice(0, 80_000);
}

function parseMetaFromHtml(html, pageUrl) {
  const head = extractHead(html);

  const title = getTitle(head) || getMetaByName(head, "title");
  const description = getMetaByName(head, "description");
  const keywords = getMetaByName(head, "keywords");
  const author = getMetaByName(head, "author");
  const robots = getMetaByName(head, "robots");
  const themeColor = getMetaByName(head, "theme-color");

  const ogTitle = getMetaByProperty(head, "og:title");
  const ogDescription = getMetaByProperty(head, "og:description");
  const ogImage = resolveUrl(pageUrl, getMetaByProperty(head, "og:image"));
  const ogUrl = resolveUrl(pageUrl, getMetaByProperty(head, "og:url"));
  const ogType = getMetaByProperty(head, "og:type") || "website";
  const ogSiteName = getMetaByProperty(head, "og:site_name");
  const ogLocale = getMetaByProperty(head, "og:locale");

  const twitterCard = getMetaByName(head, "twitter:card");
  const twitterSite = getMetaByName(head, "twitter:site");
  const twitterCreator = getMetaByName(head, "twitter:creator");
  const twitterTitle = getMetaByName(head, "twitter:title");
  const twitterDescription = getMetaByName(head, "twitter:description");
  const twitterImage = resolveUrl(
    pageUrl,
    getMetaByName(head, "twitter:image"),
  );

  const canonical = resolveUrl(
    pageUrl,
    getLinkHref(head, "canonical") || pageUrl,
  );
  const favicon = resolveUrl(
    pageUrl,
    getLinkHref(head, "icon") || getLinkHref(head, "shortcut icon"),
  );

  const foundTags = [];
  const pushTag = (tag, value) => {
    if (value) foundTags.push({ tag, value });
  };

  pushTag("title", title);
  pushTag("description", description);
  pushTag("keywords", keywords);
  pushTag("author", author);
  pushTag("robots", robots);
  pushTag("canonical", canonical);
  pushTag("theme-color", themeColor);
  pushTag("og:title", ogTitle);
  pushTag("og:description", ogDescription);
  pushTag("og:image", ogImage);
  pushTag("og:url", ogUrl);
  pushTag("og:type", ogType);
  pushTag("og:site_name", ogSiteName);
  pushTag("og:locale", ogLocale);
  pushTag("twitter:card", twitterCard);
  pushTag("twitter:site", twitterSite);
  pushTag("twitter:creator", twitterCreator);
  pushTag("twitter:title", twitterTitle);
  pushTag("twitter:description", twitterDescription);
  pushTag("twitter:image", twitterImage);
  pushTag("favicon", favicon);

  return {
    parsed: {
      title,
      description,
      keywords,
      author,
      canonical,
      robots,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl: ogUrl || canonical,
      ogType,
      ogSiteName,
      ogLocale,
      twitterCard: twitterCard || "summary_large_image",
      twitterSite,
      twitterCreator,
      twitterTitle,
      twitterDescription,
      twitterImage,
      themeColor,
      favicon,
    },
    foundTags,
  };
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "KienPortfolioMetaCrawler/1.0 (+https://kienvu.id.vn/tools/meta-tag)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      throw new Error("URL không trả về HTML");
    }

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength > MAX_BODY_BYTES) {
      throw new Error("Trang quá lớn để phân tích (>512KB HTML)");
    }

    return {
      html: Buffer.from(buffer).toString("utf8"),
      finalUrl: res.url || url,
      statusCode: res.status,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function crawlMetaTags(rawUrl) {
  const parsedUrl = assertSafeUrl(rawUrl);
  const { html, finalUrl, statusCode } = await fetchHtml(parsedUrl.href);
  const { parsed, foundTags } = parseMetaFromHtml(html, finalUrl);

  return {
    requestedUrl: parsedUrl.href,
    finalUrl,
    statusCode,
    parsed,
    foundTags,
  };
}

module.exports = {
  crawlMetaTags,
};
