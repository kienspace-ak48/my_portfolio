const seoRepository = require("../repositories/seo.repository");
const projectRepository = require("../repositories/project.repository");
const blogRepository = require("../repositories/blog.repository");
const {
  getPublicSiteUrl,
  buildCanonicalUrl,
  isLocalDevUrl,
} = require("../config/appUrl.config");
const {
  resolveTemplate,
  truncateText,
  resolveOgImageUrl,
  detectOgImageType,
} = require("../utils/seoTemplate.util");
const {
  resolvePageKey,
  extractSlug,
} = require("../utils/routePageKey.util");

const DEFAULT_PAGE_TEMPLATES = [
  {
    pageKey: "home",
    label: "Trang chủ",
    titleTemplate: "{{siteName}} — {{tagline}}",
    descriptionTemplate:
      "Portfolio và blog kỹ thuật của {{siteName}}. Dự án fullstack Node.js, React, TypeScript và công cụ dev miễn phí.",
    keywordsTemplate:
      "portfolio, fullstack developer, nodejs, react, {{siteName}}",
    robots: "index, follow",
    sortOrder: 1,
  },
  {
    pageKey: "news",
    label: "Tin tức / Stories",
    titleTemplate: "Tin tức — {{siteName}}",
    descriptionTemplate:
      "Stories và cập nhật nhanh từ {{siteName}}.",
    robots: "index, follow",
    sortOrder: 2,
  },
  {
    pageKey: "projects.index",
    label: "Danh sách dự án",
    titleTemplate: "Dự án — {{siteName}}",
    descriptionTemplate:
      "Các dự án web app, API và sản phẩm thực tế do {{siteName}} xây dựng.",
    robots: "index, follow",
    sortOrder: 3,
  },
  {
    pageKey: "project.detail",
    label: "Chi tiết dự án",
    titleTemplate: "{{projectTitle}} — {{siteName}}",
    descriptionTemplate: "{{projectSummary}}",
    keywordsTemplate: "{{projectTitle}}, portfolio, {{siteName}}",
    robots: "index, follow",
    sortOrder: 4,
  },
  {
    pageKey: "resume",
    label: "Resume",
    titleTemplate: "Resume — {{authorName}} | {{siteName}}",
    descriptionTemplate:
      "Hồ sơ nghề nghiệp {{authorName}} — Fullstack Developer. Node.js, React, TypeScript.",
    robots: "index, follow",
    sortOrder: 5,
  },
  {
    pageKey: "blog.index",
    label: "Blog",
    titleTemplate: "Blog kỹ thuật — {{siteName}}",
    descriptionTemplate:
      "Bài viết về Prisma, React, deploy production và kinh nghiệm dev thực tế.",
    robots: "index, follow",
    sortOrder: 6,
  },
  {
    pageKey: "blog.post",
    label: "Bài viết blog",
    titleTemplate: "{{blogTitle}} — {{siteName}}",
    descriptionTemplate: "{{blogExcerpt}}",
    keywordsTemplate: "{{blogTitle}}, blog, {{siteName}}",
    robots: "index, follow",
    sortOrder: 7,
  },
  {
    pageKey: "tools.index",
    label: "Công cụ",
    titleTemplate: "Công cụ dev — {{siteName}}",
    descriptionTemplate:
      "Bộ công cụ online: Base64, tra IP, tạo mật khẩu, meta tag generator.",
    robots: "index, follow",
    sortOrder: 8,
  },
  {
    pageKey: "tools.base64",
    label: "Base64",
    titleTemplate: "Mã hóa Base64 — {{siteName}}",
    descriptionTemplate: "Chuyển đổi văn bản sang Base64 và ngược lại trên trình duyệt.",
    robots: "index, follow",
    sortOrder: 9,
  },
  {
    pageKey: "tools.ip",
    label: "Tra IP",
    titleTemplate: "IP của tôi là gì? — {{siteName}}",
    descriptionTemplate:
      "Kiểm tra IP công khai, nhà mạng và vị trí ước lượng kèm bản đồ.",
    robots: "index, follow",
    sortOrder: 10,
  },
  {
    pageKey: "tools.password",
    label: "Tạo mật khẩu",
    titleTemplate: "Tạo mật khẩu mạnh — {{siteName}}",
    descriptionTemplate: "Sinh mật khẩu ngẫu nhiên với độ dài và ký tự tùy chỉnh.",
    robots: "index, follow",
    sortOrder: 11,
  },
  {
    pageKey: "tools.meta-tag",
    label: "Meta Tag Generator",
    titleTemplate: "Meta Tag Generator — {{siteName}}",
    descriptionTemplate:
      "Crawl meta từ URL hoặc sinh thẻ SEO, Open Graph và X Card kèm preview.",
    robots: "index, follow",
    sortOrder: 12,
  },
  {
    pageKey: "tools.email-signature",
    label: "Tạo chữ ký email",
    titleTemplate: "Tạo chữ ký email — {{siteName}}",
    descriptionTemplate:
      "Tạo chữ ký email HTML chuyên nghiệp cho Gmail, Outlook, Apple Mail — preview và copy nhanh.",
    robots: "index, follow",
    sortOrder: 13,
  },
  {
    pageKey: "not-found",
    label: "404",
    titleTemplate: "Không tìm thấy trang — {{siteName}}",
    descriptionTemplate: "Trang bạn tìm không tồn tại.",
    robots: "noindex, nofollow",
    sortOrder: 98,
  },
  {
    pageKey: "admin",
    label: "Admin",
    titleTemplate: "Admin — {{siteName}}",
    descriptionTemplate: "Khu vực quản trị.",
    robots: "noindex, nofollow",
    sortOrder: 99,
  },
];

function defaultGlobalSettings(siteUrl) {
  const url = siteUrl || "https://kienvu.id.vn";
  return {
    siteName: "Kien's Space",
    siteUrl: url,
    tagline: "Portfolio Fullstack Developer",
    defaultTitle: "{{siteName}} — Portfolio & công cụ dev",
    defaultDescription:
      "Chia sẻ dự án, blog kỹ thuật và công cụ dev. Node.js, React, TypeScript — Vũ Văn Kiên.",
    defaultKeywords:
      "portfolio, fullstack, nodejs, react, typescript, kienvu",
    ogImageUrl: `${url}/og-seo.png`,
    twitterSite: "",
    ogLocale: "vi_VN",
    themeColor: "#6366f1",
    organizationName: "Kien's Space",
    organizationUrl: url,
    organizationLogoUrl: `${url}/favicon.svg`,
    allowIndexing: true,
  };
}

function serializeGlobal(global) {
  if (!global) return null;
  return {
    siteName: global.siteName,
    siteUrl: global.siteUrl,
    tagline: global.tagline,
    defaultTitle: global.defaultTitle,
    defaultDescription: global.defaultDescription,
    defaultKeywords: global.defaultKeywords,
    ogImageUrl: global.ogImageUrl,
    twitterSite: global.twitterSite,
    themeColor: global.themeColor,
    ogLocale: global.ogLocale || "vi_VN",
    allowIndexing: global.allowIndexing,
    organization: {
      name: global.organizationName,
      url: global.organizationUrl,
      logoUrl: global.organizationLogoUrl,
    },
  };
}

function serializePage(page) {
  return {
    pageKey: page.pageKey,
    label: page.label,
    titleTemplate: page.titleTemplate,
    descriptionTemplate: page.descriptionTemplate,
    keywordsTemplate: page.keywordsTemplate,
    robots: page.robots,
    ogImageUrl: page.ogImageUrl,
    isActive: page.isActive,
    sortOrder: page.sortOrder,
  };
}

let defaultsReady = false;

async function ensureDefaults(req) {
  if (defaultsReady) return;
  defaultsReady = true;

  const siteUrl = getPublicSiteUrl(req);
  const existing = await seoRepository.findGlobal();

  if (!existing) {
    await seoRepository.upsertGlobal(defaultGlobalSettings(siteUrl));
  } else if (isLocalDevUrl(existing.siteUrl) && !isLocalDevUrl(siteUrl)) {
    await seoRepository.upsertGlobal({
      siteUrl,
      ogImageUrl: existing.ogImageUrl?.includes("localhost")
        ? `${siteUrl}/og-seo.png`
        : existing.ogImageUrl,
      organizationUrl: siteUrl,
    });
  }

  for (const template of DEFAULT_PAGE_TEMPLATES) {
    await seoRepository.upsertPageTemplate(template.pageKey, template);
  }
}

async function getGlobalSettings(req) {
  await ensureDefaults(req);
  return seoRepository.findGlobal();
}

async function getPublicConfig(req) {
  await ensureDefaults(req);
  const [global, pages] = await Promise.all([
    seoRepository.findGlobal(),
    seoRepository.findAllPageTemplates(),
  ]);

  return {
    global: serializeGlobal(global),
    pages: pages.filter((p) => p.isActive).map(serializePage),
  };
}

function baseVars(global) {
  return {
    siteName: global.siteName,
    tagline: global.tagline || "",
    authorName: "Vũ Văn Kiên",
  };
}

async function resolveDynamicVars(pageKey, pathname) {
  if (pageKey === "project.detail") {
    const slug = extractSlug(pathname, "/projects");
    if (!slug) return {};
    const project = await projectRepository.findBySlug(slug);
    if (!project || !project.isDisplay) return {};
    return {
      projectTitle: project.title,
      projectSummary: truncateText(project.sumary || project.desc || project.title, 160),
      projectDescription: truncateText(project.desc || project.sumary || "", 200),
      ogImage: project.thumbnail || "",
    };
  }

  if (pageKey === "blog.post") {
    const slug = extractSlug(pathname, "/blog");
    if (!slug) return {};
    const post = await blogRepository.findSeoBySlug(slug);
    if (!post) return {};
    return {
      blogTitle: post.title,
      blogExcerpt: truncateText(post.excerpt, 160),
      blogAuthor: post.authorName,
      ogImage: post.coverUrl,
    };
  }

  return {};
}

async function resolvePageMeta(req, pathname = req.path) {
  const global = await getGlobalSettings(req);
  const pageKey = resolvePageKey(pathname);
  const pageTemplate = await seoRepository.findPageTemplateByKey(pageKey);
  const siteUrl = global.siteUrl || getPublicSiteUrl(req);
  const canonical = buildCanonicalUrl(siteUrl, pathname);

  const vars = {
    ...baseVars(global),
    ...(await resolveDynamicVars(pageKey, pathname)),
  };

  const title = resolveTemplate(
    pageTemplate?.titleTemplate || global.defaultTitle,
    vars,
  ).trim() || global.siteName;

  const description = truncateText(
    resolveTemplate(
      pageTemplate?.descriptionTemplate || global.defaultDescription,
      vars,
    ),
    200,
  );

  const keywords = resolveTemplate(
    pageTemplate?.keywordsTemplate || global.defaultKeywords || "",
    vars,
  ).trim();

  const robots =
    pageTemplate?.robots ||
    (pageKey === "admin" || pageKey === "not-found"
      ? "noindex, nofollow"
      : "index, follow");

  const ogImage = resolveOgImageUrl({
    global,
    pageTemplate,
    vars,
    siteUrl,
  });

  return {
    pageKey,
    title,
    description,
    keywords,
    robots,
    canonical,
    ogImage,
    ogImageSecure: ogImage.replace(/^http:\/\//i, "https://"),
    ogImageType: detectOgImageType(ogImage),
    siteName: global.siteName,
    twitterSite: global.twitterSite || "",
    themeColor: global.themeColor || "#6366f1",
    ogLocale: global.ogLocale || "vi_VN",
    ogTitle: title,
    ogDescription: description,
    vars,
  };
}

async function resolveSpaMeta(req) {
  return resolvePageMeta(req, req.path);
}

async function updateGlobalSettings(data) {
  const payload = {
    siteName: data.siteName,
    siteUrl: data.siteUrl,
    tagline: data.tagline,
    defaultTitle: data.defaultTitle,
    defaultDescription: data.defaultDescription,
    defaultKeywords: data.defaultKeywords,
    ogImageUrl: data.ogImageUrl,
    twitterSite: data.twitterSite,
    themeColor: data.themeColor,
    ogLocale: data.ogLocale || "vi_VN",
    allowIndexing: data.allowIndexing ?? true,
    organizationName: data.organization?.name,
    organizationUrl: data.organization?.url,
    organizationLogoUrl: data.organization?.logoUrl,
  };
  return seoRepository.upsertGlobal(payload);
}

async function updatePageTemplate(pageKey, data) {
  if (data.ogImageUrl && !require("../utils/seoTemplate.util").isAllowedOgImage(data.ogImageUrl)) {
    throw new Error("OG image không hỗ trợ AVIF/WebP/SVG (Zalo/Facebook preview).");
  }

  return seoRepository.upsertPageTemplate(pageKey, {
    label: data.label,
    titleTemplate: data.titleTemplate,
    descriptionTemplate: data.descriptionTemplate,
    keywordsTemplate: data.keywordsTemplate,
    robots: data.robots,
    ogImageUrl: data.ogImageUrl || null,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
  });
}

module.exports = {
  ensureDefaults,
  getPublicConfig,
  resolveSpaMeta,
  resolvePageMeta,
  updateGlobalSettings,
  updatePageTemplate,
  serializeGlobal,
  serializePage,
  DEFAULT_PAGE_TEMPLATES,
};
