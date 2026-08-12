export type TwitterCardType =
  | "summary"
  | "summary_large_image"
  | "app"
  | "player";

export type OgType = "website" | "article" | "product" | "profile";

export type MetaTagForm = {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonical: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: OgType;
  ogSiteName: string;
  ogLocale: string;
  twitterCard: TwitterCardType;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  themeColor: string;
  favicon: string;
};

export const DEFAULT_META_FORM: MetaTagForm = {
  title: "",
  description: "",
  keywords: "",
  author: "",
  canonical: "",
  robots: "index, follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogUrl: "",
  ogType: "website",
  ogSiteName: "",
  ogLocale: "vi_VN",
  twitterCard: "summary_large_image",
  twitterSite: "",
  twitterCreator: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  themeColor: "#ea580c",
  favicon: "",
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tag(name: string, content: string, property = false): string {
  if (!content.trim()) return "";
  const attr = property ? "property" : "name";
  return `<meta ${attr}="${name}" content="${escapeAttr(content.trim())}" />`;
}

function linkTag(rel: string, href: string): string {
  if (!href.trim()) return "";
  return `<link rel="${rel}" href="${escapeAttr(href.trim())}" />`;
}

export function resolveMetaValues(form: MetaTagForm) {
  const title = form.title.trim();
  const description = form.description.trim();
  const ogTitle = form.ogTitle.trim() || title;
  const ogDescription = form.ogDescription.trim() || description;
  const ogImage = form.ogImage.trim();
  const ogUrl = form.ogUrl.trim() || form.canonical.trim();
  const twitterTitle = form.twitterTitle.trim() || ogTitle || title;
  const twitterDescription =
    form.twitterDescription.trim() || ogDescription || description;
  const twitterImage = form.twitterImage.trim() || ogImage;

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage,
  };
}

export function buildMetaTagsHtml(form: MetaTagForm): string {
  const v = resolveMetaValues(form);
  const lines: string[] = [];

  lines.push("<!-- Primary Meta Tags -->");
  if (v.title) lines.push(`<title>${escapeAttr(v.title)}</title>`);
  lines.push(tag("title", v.title));
  lines.push(tag("description", v.description));
  lines.push(tag("keywords", form.keywords));
  lines.push(tag("author", form.author));
  lines.push(tag("robots", form.robots));
  lines.push(linkTag("canonical", form.canonical));
  lines.push(linkTag("icon", form.favicon));
  lines.push(tag("theme-color", form.themeColor));

  lines.push("");
  lines.push("<!-- Open Graph / Facebook -->");
  lines.push(tag("og:type", form.ogType, true));
  lines.push(tag("og:url", v.ogUrl, true));
  lines.push(tag("og:title", v.ogTitle, true));
  lines.push(tag("og:description", v.ogDescription, true));
  lines.push(tag("og:image", v.ogImage, true));
  lines.push(tag("og:site_name", form.ogSiteName, true));
  lines.push(tag("og:locale", form.ogLocale, true));

  lines.push("");
  lines.push("<!-- Twitter / X -->");
  lines.push(tag("twitter:card", form.twitterCard));
  lines.push(tag("twitter:url", v.ogUrl));
  lines.push(tag("twitter:title", v.twitterTitle));
  lines.push(tag("twitter:description", v.twitterDescription));
  lines.push(tag("twitter:image", v.twitterImage));
  lines.push(tag("twitter:site", form.twitterSite));
  lines.push(tag("twitter:creator", form.twitterCreator));

  lines.push("");
  lines.push("<!-- LinkedIn, Zalo, Telegram dùng Open Graph -->");

  return lines.filter(Boolean).join("\n");
}

export function charStatus(
  length: number,
  good: number,
  max: number,
): "good" | "warn" | "bad" {
  if (length === 0) return "good";
  if (length <= good) return "good";
  if (length <= max) return "warn";
  return "bad";
}

export type InspectorStatus = "ok" | "warn" | "error";

export type InspectorCheck = {
  id: string;
  label: string;
  tag: string;
  status: InspectorStatus;
  detail: string;
};

export function inspectMetaTags(form: MetaTagForm): InspectorCheck[] {
  const v = resolveMetaValues(form);
  const checks: InspectorCheck[] = [];

  const titleLen = v.title.length;
  checks.push({
    id: "title",
    label: "Title is present",
    tag: "title",
    status: titleLen ? (titleLen <= 70 ? "ok" : "warn") : "error",
    detail: titleLen
      ? `${titleLen} ký tự${titleLen <= 60 ? " — trong ngưỡng khuyến nghị" : titleLen <= 70 ? " — hơi dài" : " — quá dài"}`
      : "Thiếu title",
  });

  const descLen = v.description.length;
  checks.push({
    id: "description",
    label: "Description is present",
    tag: "description",
    status: descLen ? (descLen <= 200 ? "ok" : "warn") : "error",
    detail: descLen
      ? `${descLen} ký tự${descLen <= 160 ? " — trong ngưỡng khuyến nghị" : ""}`
      : "Thiếu description",
  });

  checks.push({
    id: "canonical",
    label: "Canonical URL is set",
    tag: "canonical",
    status: form.canonical.trim() ? "ok" : "warn",
    detail: form.canonical.trim() || "Nên có canonical cho SEO",
  });

  checks.push({
    id: "og-title",
    label: "OG title is present",
    tag: "og:title",
    status: v.ogTitle ? "ok" : "error",
    detail: v.ogTitle || "Thiếu og:title",
  });

  checks.push({
    id: "og-description",
    label: "OG description is present",
    tag: "og:description",
    status: v.ogDescription ? "ok" : "warn",
    detail: v.ogDescription || "Nên có og:description",
  });

  checks.push({
    id: "og-image",
    label: "OG image is set",
    tag: "og:image",
    status: v.ogImage
      ? v.ogImage.startsWith("https://")
        ? "ok"
        : "warn"
      : "error",
    detail: v.ogImage
      ? v.ogImage.startsWith("https://")
        ? "Ảnh HTTPS"
        : "Nên dùng HTTPS cho og:image"
      : "Thiếu og:image — preview sẽ không có ảnh",
  });

  checks.push({
    id: "og-url",
    label: "OG URL is set",
    tag: "og:url",
    status: v.ogUrl ? "ok" : "warn",
    detail: v.ogUrl || "Nên có og:url",
  });

  checks.push({
    id: "og-site",
    label: "Site name is set",
    tag: "og:site_name",
    status: form.ogSiteName.trim() ? "ok" : "warn",
    detail: form.ogSiteName.trim() || "Nên có og:site_name",
  });

  checks.push({
    id: "twitter-card",
    label: "X card type is set",
    tag: "twitter:card",
    status: form.twitterCard ? "ok" : "warn",
    detail:
      form.twitterCard === "summary_large_image"
        ? "Large image card — khuyến nghị cho X"
        : form.twitterCard,
  });

  checks.push({
    id: "twitter-title",
    label: "X title is present",
    tag: "twitter:title",
    status: v.twitterTitle ? "ok" : "warn",
    detail: v.twitterTitle
      ? `${v.twitterTitle.length} ký tự`
      : "Fallback sang og:title khi publish",
  });

  if (form.twitterCard === "summary_large_image") {
    checks.push({
      id: "twitter-image",
      label: "X card uses a large image",
      tag: "twitter:image",
      status: v.twitterImage ? "ok" : "error",
      detail: v.twitterImage || "Cần twitter:image cho large card",
    });
  }

  return checks;
}

export function inspectorSummary(checks: InspectorCheck[]) {
  return {
    ok: checks.filter((c) => c.status === "ok").length,
    warn: checks.filter((c) => c.status === "warn").length,
    error: checks.filter((c) => c.status === "error").length,
  };
}

export type CrawlSuggestion = {
  tag: string;
  issue: string;
  fix: string;
  status: InspectorStatus;
};

const OG_TYPES_SET = new Set<OgType>(["website", "article", "product", "profile"]);
const TWITTER_CARDS_SET = new Set<TwitterCardType>([
  "summary",
  "summary_large_image",
  "app",
  "player",
]);

export function formFromCrawledParsed(
  parsed: Partial<Record<keyof MetaTagForm, string>>,
): MetaTagForm {
  const ogType = OG_TYPES_SET.has(parsed.ogType as OgType)
    ? (parsed.ogType as OgType)
    : "website";
  const twitterCard = TWITTER_CARDS_SET.has(
    parsed.twitterCard as TwitterCardType,
  )
    ? (parsed.twitterCard as TwitterCardType)
    : "summary_large_image";

  return {
    ...DEFAULT_META_FORM,
    title: parsed.title ?? "",
    description: parsed.description ?? "",
    keywords: parsed.keywords ?? "",
    author: parsed.author ?? "",
    canonical: parsed.canonical ?? "",
    robots: parsed.robots ?? DEFAULT_META_FORM.robots,
    ogTitle: parsed.ogTitle ?? "",
    ogDescription: parsed.ogDescription ?? "",
    ogImage: parsed.ogImage ?? "",
    ogUrl: parsed.ogUrl ?? "",
    ogType,
    ogSiteName: parsed.ogSiteName ?? "",
    ogLocale: parsed.ogLocale ?? DEFAULT_META_FORM.ogLocale,
    twitterCard,
    twitterSite: parsed.twitterSite ?? "",
    twitterCreator: parsed.twitterCreator ?? "",
    twitterTitle: parsed.twitterTitle ?? "",
    twitterDescription: parsed.twitterDescription ?? "",
    twitterImage: parsed.twitterImage ?? "",
    themeColor: parsed.themeColor ?? DEFAULT_META_FORM.themeColor,
    favicon: parsed.favicon ?? "",
  };
}

export function buildCrawlSuggestions(form: MetaTagForm): CrawlSuggestion[] {
  const checks = inspectMetaTags(form);
  const fixMap: Record<string, string> = {
    title:
      "Thêm thẻ <title> hoặc meta name=\"title\" mô tả rõ nội dung trang (50–60 ký tự).",
    description:
      "Thêm meta name=\"description\" tóm tắt trang trong 150–160 ký tự.",
    canonical:
      "Thêm <link rel=\"canonical\" href=\"...\"> trỏ URL chính thức, tránh trùng lặp SEO.",
    "og:title":
      "Thêm meta property=\"og:title\" — tiêu đề hiển thị khi share Facebook/Zalo.",
    "og:description":
      "Thêm meta property=\"og:description\" mô tả preview social.",
    "og:image":
      "Thêm meta property=\"og:image\" ảnh 1200×630 px, URL HTTPS tuyệt đối.",
    "og:url":
      "Thêm meta property=\"og:url\" khớp URL canonical của trang.",
    "og:site_name":
      "Thêm meta property=\"og:site_name\" (tên website/thương hiệu).",
    "twitter:card":
      "Thêm meta name=\"twitter:card\" — khuyến nghị summary_large_image.",
    "twitter:title":
      "Thêm meta name=\"twitter:title\" hoặc đảm bảo og:title đủ tốt.",
    "twitter:image":
      "Thêm meta name=\"twitter:image\" khi dùng large image card trên X.",
  };

  return checks
    .filter((check) => check.status !== "ok")
    .map((check) => ({
      tag: check.tag,
      issue: check.detail,
      fix: fixMap[check.tag] ?? `Bổ sung hoặc tối ưu thẻ ${check.tag}.`,
      status: check.status,
    }));
}

export function listMissingTags(foundTags: { tag: string; value: string }[]) {
  const found = new Set(foundTags.map((item) => item.tag));
  const expected = [
    { tag: "title", label: "Title", level: "required" as const },
    { tag: "description", label: "Description", level: "required" as const },
    { tag: "canonical", label: "Canonical", level: "recommended" as const },
    { tag: "og:title", label: "OG Title", level: "required" as const },
    { tag: "og:description", label: "OG Description", level: "required" as const },
    { tag: "og:image", label: "OG Image", level: "required" as const },
    { tag: "og:url", label: "OG URL", level: "recommended" as const },
    { tag: "og:site_name", label: "OG Site Name", level: "recommended" as const },
    { tag: "twitter:card", label: "Twitter Card", level: "recommended" as const },
    { tag: "twitter:image", label: "Twitter Image", level: "recommended" as const },
  ];

  return expected.filter((item) => !found.has(item.tag));
}
