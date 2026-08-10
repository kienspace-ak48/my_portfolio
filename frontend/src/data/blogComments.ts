import type { BlogComment } from "../types/blog";

/** Mock comments theo postId — sẽ thay bằng API sau */
export const BLOG_COMMENTS_SEED: BlogComment[] = [
  {
    id: "c1",
    postId: "1",
    parentId: null,
    authorName: "Minh Trần",
    avatarUrl: "https://i.pravatar.cc/150?u=comment-minh",
    content:
      "Bài viết đúng vấn đề mình vừa gặp trên VPS. Phần @@map cho bảng User vs user cứu mình một buổi debug.",
    createdAt: "2026-08-06T09:20:00.000Z",
    likes: 5,
  },
  {
    id: "c2",
    postId: "1",
    parentId: "c1",
    authorName: "Vũ Văn Kiên",
    avatarUrl: "https://i.pravatar.cc/150?u=kien-blog",
    content:
      "Cảm ơn bạn. Nếu cần mình có thể thêm checklist migrate deploy riêng cho team nhỏ.",
    createdAt: "2026-08-06T11:00:00.000Z",
    likes: 2,
  },
  {
    id: "c3",
    postId: "1",
    parentId: null,
    authorName: "Lan Nguyễn",
    avatarUrl: "https://i.pravatar.cc/150?u=comment-lan",
    content:
      "Cho hỏi thêm: khi đã lỡ apply migration sai, ngoài reset DB còn cách nào an toàn hơn trên staging không?",
    createdAt: "2026-08-05T16:45:00.000Z",
    likes: 3,
  },
  {
    id: "c4",
    postId: "2",
    parentId: null,
    authorName: "Dev Junior",
    avatarUrl: "https://i.pravatar.cc/150?u=comment-junior",
    content:
      "Cách tách section Home rất dễ maintain. Mình sẽ áp dụng cho portfolio đang làm.",
    createdAt: "2026-08-04T08:10:00.000Z",
    likes: 4,
  },
  {
    id: "c5",
    postId: "3",
    parentId: null,
    authorName: "Hùng Phạm",
    avatarUrl: "https://i.pravatar.cc/150?u=comment-hung",
    content:
      "Interceptor refresh token dedupe bằng shared promise — trick hay, tránh gọi refresh 5 lần cùng lúc.",
    createdAt: "2026-07-29T14:30:00.000Z",
    likes: 6,
  },
];

const STORAGE_KEY = "blog-comments-local";

export type LocalCommentMeta = {
  comments: BlogComment[];
  likedIds: string[];
  likeOverrides: Record<string, number>;
};

export function loadLocalComments(): LocalCommentMeta {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { comments: [], likedIds: [], likeOverrides: {} };
    const parsed = JSON.parse(raw) as Partial<LocalCommentMeta>;
    return {
      comments: parsed.comments ?? [],
      likedIds: parsed.likedIds ?? [],
      likeOverrides: parsed.likeOverrides ?? {},
    };
  } catch {
    return { comments: [], likedIds: [], likeOverrides: {} };
  }
}

export function saveLocalComments(meta: LocalCommentMeta) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
}

export function getSeedCommentsForPost(postId: string) {
  return BLOG_COMMENTS_SEED.filter((c) => c.postId === postId);
}
