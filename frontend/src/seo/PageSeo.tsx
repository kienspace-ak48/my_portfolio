import { useEffect } from "react";
import { useSeoContext } from "./SeoContext";

function upsertMeta(
  selector: string,
  attributes: Record<string, string>,
  createFn: () => HTMLElement,
) {
  let element = document.head.querySelector(selector) as HTMLElement | null;
  if (!element) {
    element = createFn();
    document.head.appendChild(element);
  }
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function upsertJsonLd(blocks: Record<string, unknown>[]) {
  document
    .querySelectorAll('script[type="application/ld+json"][data-seo-jsonld="1"]')
    .forEach((node) => node.remove());

  blocks.forEach((block, index) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-jsonld", "1");
    script.setAttribute("data-seo-jsonld-index", String(index));
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  });
}

function PageSeo() {
  const { resolved, jsonLd } = useSeoContext();

  useEffect(() => {
    if (!resolved) return;

    document.documentElement.lang = (resolved.ogLocale.split("_")[0] || "vi").toLowerCase();
    document.title = resolved.title;

    upsertMeta('meta[name="description"]', { name: "description", content: resolved.description }, () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      return meta;
    });

    upsertMeta('meta[name="keywords"]', { name: "keywords", content: resolved.keywords }, () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "keywords");
      return meta;
    });

    upsertMeta('meta[name="robots"]', { name: "robots", content: resolved.robots }, () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      return meta;
    });

    upsertMeta('meta[name="theme-color"]', { name: "theme-color", content: resolved.themeColor }, () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      return meta;
    });

    upsertLink("canonical", resolved.canonical);

    const ogPairs: Array<[string, string]> = [
      ["og:type", "website"],
      ["og:locale", resolved.ogLocale],
      ["og:site_name", resolved.siteName],
      ["og:title", resolved.ogTitle],
      ["og:description", resolved.ogDescription],
      ["og:url", resolved.canonical],
    ];

    if (resolved.ogImage) {
      ogPairs.push(["og:image", resolved.ogImage]);
      ogPairs.push(["og:image:secure_url", resolved.ogImage.replace(/^http:\/\//i, "https://")]);
      ogPairs.push(["og:image:type", /\.png(\?|$)/i.test(resolved.ogImage) ? "image/png" : "image/jpeg"]);
    }

    ogPairs.forEach(([property, content]) => {
      upsertMeta(`meta[property="${property}"]`, { property, content }, () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", property);
        return meta;
      });
    });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" }, () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "twitter:card");
      return meta;
    });

    if (resolved.twitterSite) {
      upsertMeta('meta[name="twitter:site"]', { name: "twitter:site", content: resolved.twitterSite }, () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:site");
        return meta;
      });
    }

    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: resolved.ogTitle }, () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "twitter:title");
      return meta;
    });

    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: resolved.ogDescription }, () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "twitter:description");
      return meta;
    });

    if (resolved.ogImage) {
      upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: resolved.ogImage }, () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:image");
        return meta;
      });
    }

    upsertJsonLd(jsonLd);
  }, [resolved, jsonLd]);

  return null;
}

export default PageSeo;
