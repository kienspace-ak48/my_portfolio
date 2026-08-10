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

export type BlogCategory =
  | "backend"
  | "frontend"
  | "devops"
  | "career"
  | "tutorial";

export type BlogAuthor = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
};

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
  tags: string[];
  authorId: string;
  publishedAt: string;
  updatedAt?: string;
  readMinutes: number;
  featured?: boolean;
  content: ContentBlock[];
};

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  backend: "Backend",
  frontend: "Frontend",
  devops: "DevOps",
  career: "Career",
  tutorial: "Tutorial",
};
