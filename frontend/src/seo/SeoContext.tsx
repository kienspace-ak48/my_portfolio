import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { fetchSeoConfig } from "../api/seoApi";
import { buildJsonLdBlocks, resolveSeoFromConfig } from "./buildJsonLd";
import { resolvePageKey } from "./routePageKey";
import type {
  ResolvedSeo,
  SeoBreadcrumb,
  SeoPublicConfig,
  SeoVars,
} from "./types";

type SeoContextValue = {
  loading: boolean;
  config: SeoPublicConfig | null;
  pageKey: string;
  vars: SeoVars;
  breadcrumbs: SeoBreadcrumb[];
  resolved: ResolvedSeo | null;
  jsonLd: Record<string, unknown>[];
  setSeoVars: (vars: SeoVars) => void;
  setSeoBreadcrumbs: (items: SeoBreadcrumb[]) => void;
};

const FALLBACK_CONFIG: SeoPublicConfig = {
  global: {
    siteName: "Kien's Space",
    siteUrl: typeof window !== "undefined" ? window.location.origin : "https://kienvu.id.vn",
    tagline: "Portfolio Fullstack Developer",
    defaultTitle: "{{siteName}} — Portfolio & công cụ dev",
    defaultDescription:
      "Chia sẻ dự án, blog kỹ thuật và công cụ dev. Node.js, React, TypeScript.",
    defaultKeywords: "portfolio, fullstack, nodejs, react",
    ogImageUrl: "/og-seo.png",
    themeColor: "#6366f1",
    ogLocale: "vi_VN",
    organization: {
      name: "Kien's Space",
    },
  },
  pages: [
    {
      pageKey: "admin",
      label: "Admin",
      titleTemplate: "Admin — {{siteName}}",
      descriptionTemplate: "Khu vực quản trị.",
      robots: "noindex, nofollow",
      isActive: true,
      sortOrder: 99,
    },
  ],
};

const SeoContext = createContext<SeoContextValue | null>(null);

export function SeoProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<SeoPublicConfig | null>(null);
  const [vars, setVarsState] = useState<SeoVars>({});
  const [breadcrumbs, setBreadcrumbsState] = useState<SeoBreadcrumb[]>([]);

  useEffect(() => {
    let active = true;
    fetchSeoConfig()
      .then((data) => {
        if (active) setConfig(data);
      })
      .catch(() => {
        if (active) setConfig(FALLBACK_CONFIG);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setVarsState({});
    setBreadcrumbsState([]);
  }, [pathname]);

  const pageKey = useMemo(() => resolvePageKey(pathname), [pathname]);
  const effectiveConfig = config ?? FALLBACK_CONFIG;

  const pageTemplate = useMemo(
    () => effectiveConfig.pages.find((page) => page.pageKey === pageKey),
    [effectiveConfig.pages, pageKey],
  );

  const resolved = useMemo(() => {
    return resolveSeoFromConfig({
      pageKey,
      global: effectiveConfig.global,
      pageTemplate,
      pathname,
      vars,
    });
  }, [pageKey, effectiveConfig, pageTemplate, pathname, vars]);

  const jsonLd = useMemo(
    () =>
      buildJsonLdBlocks({
        pageKey,
        global: effectiveConfig.global,
        canonical: resolved.canonical,
        title: resolved.title,
        description: resolved.description,
        ogImage: resolved.ogImage,
        vars: {
          siteName: effectiveConfig.global.siteName,
          tagline: effectiveConfig.global.tagline,
          authorName: "Vũ Văn Kiên",
          ...vars,
        },
        breadcrumbs,
      }),
    [pageKey, effectiveConfig, resolved, vars, breadcrumbs],
  );

  const setSeoVars = useCallback((next: SeoVars) => {
    setVarsState(next);
  }, []);

  const setSeoBreadcrumbs = useCallback((items: SeoBreadcrumb[]) => {
    setBreadcrumbsState(items);
  }, []);

  const value = useMemo<SeoContextValue>(
    () => ({
      loading,
      config: effectiveConfig,
      pageKey,
      vars,
      breadcrumbs,
      resolved,
      jsonLd,
      setSeoVars,
      setSeoBreadcrumbs,
    }),
    [
      loading,
      effectiveConfig,
      pageKey,
      vars,
      breadcrumbs,
      resolved,
      jsonLd,
      setSeoVars,
      setSeoBreadcrumbs,
    ],
  );

  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>;
}

export function useSeoContext(): SeoContextValue {
  const ctx = useContext(SeoContext);
  if (!ctx) {
    throw new Error("useSeoContext must be used within SeoProvider");
  }
  return ctx;
}
