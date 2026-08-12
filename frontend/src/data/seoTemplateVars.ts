import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FolderKanban,
  Globe,
  ImageIcon,
  User,
} from "lucide-react";

export type SeoVarGroup = "site" | "author" | "project" | "blog" | "auto";

export type SeoTemplateVar = {
  key: string;
  token: string;
  label: string;
  group: SeoVarGroup;
  description: string;
  /** pageKey patterns where this var is filled automatically */
  autoOn?: string[];
};

export const SEO_VAR_GROUPS: Record<
  SeoVarGroup,
  { label: string; icon: LucideIcon; hint: string }
> = {
  site: {
    label: "Site",
    icon: Globe,
    hint: "Có sẵn mọi trang — lấy từ Global.",
  },
  author: {
    label: "Tác giả",
    icon: User,
    hint: "Resume và template có {{authorName}}.",
  },
  project: {
    label: "Dự án",
    icon: FolderKanban,
    hint: "Chỉ trang /projects/:slug — fill sau khi load API.",
  },
  blog: {
    label: "Blog",
    icon: FileText,
    hint: "Chỉ trang /blog/:slug — fill từ dữ liệu bài viết.",
  },
  auto: {
    label: "OG tự động",
    icon: ImageIcon,
    hint: "Không gõ trong template — hệ thống gán ảnh khi share.",
  },
};

export const SEO_TEMPLATE_VARS: SeoTemplateVar[] = [
  {
    key: "siteName",
    token: "{{siteName}}",
    label: "Tên site",
    group: "site",
    description: "Tên thương hiệu, vd: Kien's Space",
  },
  {
    key: "tagline",
    token: "{{tagline}}",
    label: "Tagline",
    group: "site",
    description: "Mô tả ngắn site, vd: Portfolio Fullstack Developer",
  },
  {
    key: "authorName",
    token: "{{authorName}}",
    label: "Tác giả",
    group: "author",
    description: "Tên hiển thị trên Resume / JSON-LD Person",
  },
  {
    key: "projectTitle",
    token: "{{projectTitle}}",
    label: "Tên dự án",
    group: "project",
    description: "Title dự án từ database",
    autoOn: ["project.detail"],
  },
  {
    key: "projectSummary",
    token: "{{projectSummary}}",
    label: "Tóm tắt dự án",
    group: "project",
    description: "Mô tả ngắn ~160 ký tự",
    autoOn: ["project.detail"],
  },
  {
    key: "projectDescription",
    token: "{{projectDescription}}",
    label: "Mô tả dự án",
    group: "project",
    description: "Mô tả dài hơn (meta description)",
    autoOn: ["project.detail"],
  },
  {
    key: "blogTitle",
    token: "{{blogTitle}}",
    label: "Tiêu đề blog",
    group: "blog",
    description: "Title bài viết",
    autoOn: ["blog.post"],
  },
  {
    key: "blogExcerpt",
    token: "{{blogExcerpt}}",
    label: "Excerpt blog",
    group: "blog",
    description: "Đoạn mở bài / excerpt",
    autoOn: ["blog.post"],
  },
  {
    key: "blogAuthor",
    token: "{{blogAuthor}}",
    label: "Tác giả bài viết",
    group: "blog",
    description: "Tên tác giả blog",
    autoOn: ["blog.post"],
  },
];

/** Trang động — OG lấy thumbnail/cover, không cần set OG riêng trong admin */
export const DYNAMIC_OG_PAGE_KEYS = new Set(["project.detail", "blog.post"]);

export const SEO_META_COVERAGE = [
  { id: "title", label: "title / og:title", scope: "global + page" },
  { id: "description", label: "description / og:description", scope: "global + page" },
  { id: "keywords", label: "meta keywords", scope: "global + page (optional)" },
  { id: "robots", label: "robots", scope: "page template" },
  { id: "canonical", label: "canonical", scope: "auto từ siteUrl + path" },
  { id: "og-image", label: "og:image", scope: "global → page override → entity" },
  { id: "theme-color", label: "theme-color", scope: "global" },
  { id: "twitter", label: "twitter:card + site", scope: "global" },
  { id: "json-ld", label: "JSON-LD", scope: "Organization, WebSite, Breadcrumb…" },
  { id: "locale", label: "og:locale", scope: "global (vd: vi_VN)" },
];
