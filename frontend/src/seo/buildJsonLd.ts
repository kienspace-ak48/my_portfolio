import type { SeoBreadcrumb, SeoGlobalConfig, SeoVars } from "./types";
import {
  buildCanonicalUrl,
  resolveOgImageUrl,
  resolveTemplate,
  truncateText,
} from "./resolveTemplate";

type JsonLd = Record<string, unknown>;

function siteOrigin(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, "");
}

export function buildJsonLdBlocks({
  pageKey,
  global,
  canonical,
  title,
  description,
  ogImage,
  vars,
  breadcrumbs,
}: {
  pageKey: string;
  global: SeoGlobalConfig;
  canonical: string;
  title: string;
  description: string;
  ogImage: string;
  vars: SeoVars;
  breadcrumbs: SeoBreadcrumb[];
}): JsonLd[] {
  const origin = siteOrigin(global.siteUrl);
  const blocks: JsonLd[] = [];

  if (global.organization?.name) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: global.organization.name,
      url: global.organization.url || origin,
      logo: global.organization.logoUrl || undefined,
    });
  }

  if (pageKey === "home") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: global.siteName,
      url: origin,
      description: global.defaultDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: `${origin}/projects?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
  }

  if (breadcrumbs.length > 1) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: buildCanonicalUrl(global.siteUrl, item.path),
      })),
    });
  }

  if (pageKey === "project.detail" && vars.projectTitle) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: vars.projectTitle,
      description: vars.projectSummary || description,
      url: canonical,
      image: ogImage || undefined,
      applicationCategory: "WebApplication",
      author: {
        "@type": "Person",
        name: vars.authorName || "Vũ Văn Kiên",
      },
    });
  }

  if (pageKey === "blog.post" && vars.blogTitle) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: vars.blogTitle,
      description: vars.blogExcerpt || description,
      image: ogImage || undefined,
      url: canonical,
      author: {
        "@type": "Person",
        name: vars.blogAuthor || "Vũ Văn Kiên",
      },
      publisher: {
        "@type": "Organization",
        name: global.siteName,
        logo: global.organization?.logoUrl
          ? { "@type": "ImageObject", url: global.organization.logoUrl }
          : undefined,
      },
    });
  }

  if (pageKey === "resume") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: title,
      description,
      url: canonical,
      mainEntity: {
        "@type": "Person",
        name: vars.authorName || "Vũ Văn Kiên",
        jobTitle: "Fullstack Developer",
      },
    });
  }

  return blocks;
}

export function resolveSeoFromConfig({
  pageKey,
  global,
  pageTemplate,
  pathname,
  vars,
}: {
  pageKey: string;
  global: SeoGlobalConfig;
  pageTemplate?: {
    titleTemplate: string;
    descriptionTemplate: string;
    keywordsTemplate?: string | null;
    robots: string;
    ogImageUrl?: string | null;
  };
  pathname: string;
  vars: SeoVars;
}): {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  canonical: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  siteName: string;
  twitterSite: string;
  themeColor: string;
  ogLocale: string;
} {
  const mergedVars: SeoVars = {
    siteName: global.siteName,
    tagline: global.tagline,
    authorName: "Vũ Văn Kiên",
    ...vars,
  };

  const title =
    resolveTemplate(pageTemplate?.titleTemplate || global.defaultTitle, mergedVars).trim() ||
    global.siteName;

  const description = truncateText(
    resolveTemplate(
      pageTemplate?.descriptionTemplate || global.defaultDescription,
      mergedVars,
    ),
    200,
  );

  const keywords = resolveTemplate(
    pageTemplate?.keywordsTemplate || global.defaultKeywords || "",
    mergedVars,
  ).trim();

  const robots =
    pageTemplate?.robots ||
    (pageKey === "admin" || pageKey === "not-found"
      ? "noindex, nofollow"
      : "index, follow");

  const canonical = buildCanonicalUrl(global.siteUrl, pathname);
  const ogImage = resolveOgImageUrl({
    globalOg: global.ogImageUrl,
    pageOg: pageTemplate?.ogImageUrl,
    varOg: mergedVars.ogImage,
    siteUrl: global.siteUrl,
  });

  return {
    title,
    description,
    keywords,
    robots,
    canonical,
    ogImage,
    ogTitle: title,
    ogDescription: description,
    siteName: global.siteName,
    twitterSite: global.twitterSite || "",
    themeColor: global.themeColor || "#6366f1",
    ogLocale: global.ogLocale || "vi_VN",
  };
}
