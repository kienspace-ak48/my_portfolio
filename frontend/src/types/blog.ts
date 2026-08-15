export type BlogComment = {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string;
  authorEmail?: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  likes: number;
};

export type BlogCommentSort = "newest" | "oldest" | "popular";

export type BlogCategory = string;

export type BlogPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BlogAuthor = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
};

/** @deprecated Mock-only block format — API stores HTML from TinyMCE */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "code"; language: string; code: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; variant: "tip" | "note" | "warning"; title?: string; text: string };

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  category: BlogCategory;
  categoryLabel?: string;
  tags: string[];
  authorId: string;
  author?: BlogAuthor | null;
  authorName?: string;
  publishedAt: string;
  updatedAt?: string;
  readMinutes: number;
  featured?: boolean;
  featuredOrder?: number;
  viewCount?: number;
  status?: BlogPostStatus;
  isDisplay?: boolean;
  content?: string;
};

export type BlogPostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  category: BlogCategory;
  status: BlogPostStatus;
  isDisplay: boolean;
  featured: boolean;
  featuredOrder: number;
  readMinutes: number;
  publishedAt: string;
  tags: string[];
};

export type BlogQuery = {
  q?: string;
  category?: string;
  tag?: string;
  sort?: "newest" | "popular";
  featured?: string;
};

export function blogCategoryLabel(
  post: Pick<BlogPost, "category" | "categoryLabel">,
  map?: Record<string, string>,
): string {
  return post.categoryLabel ?? map?.[post.category] ?? post.category;
}

export const BLOG_STATUS_OPTIONS: { value: BlogPostStatus; label: string }[] = [
  { value: "DRAFT", label: "Nháp" },
  { value: "PUBLISHED", label: "Đã xuất bản" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];

export function blogStatusLabel(status: BlogPostStatus): string {
  return BLOG_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function toBlogPayload(form: BlogPostForm) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content,
    coverUrl: form.coverUrl.trim() || null,
    category: form.category,
    status: form.status,
    isDisplay: form.isDisplay,
    featured: form.featured,
    featuredOrder: form.featured ? form.featuredOrder : 0,
    readMinutes: form.readMinutes,
    publishedAt: form.publishedAt || null,
    tags: form.tags,
  };
}
