export type SeoOrganization = {
  name?: string;
  url?: string;
  logoUrl?: string;
};

export type SeoGlobalConfig = {
  siteName: string;
  siteUrl: string;
  tagline?: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords?: string;
  ogImageUrl?: string;
  twitterSite?: string;
  themeColor?: string;
  ogLocale?: string;
  allowIndexing?: boolean;
  organization?: SeoOrganization;
};

export type SeoPageTemplate = {
  pageKey: string;
  label: string;
  titleTemplate: string;
  descriptionTemplate: string;
  keywordsTemplate?: string;
  robots: string;
  ogImageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type SeoPublicConfig = {
  global: SeoGlobalConfig;
  pages: SeoPageTemplate[];
};

export type SeoVars = Record<string, string | undefined>;

export type SeoBreadcrumb = {
  name: string;
  path: string;
};

export type ResolvedSeo = {
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
};
