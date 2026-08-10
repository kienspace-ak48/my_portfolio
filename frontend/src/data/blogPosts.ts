import type { BlogAuthor, BlogPost } from "../types/blog";

export const BLOG_AUTHORS: Record<string, BlogAuthor> = {
  kien: {
    id: "kien",
    name: "Vũ Văn Kiên",
    role: "Fullstack Developer",
    avatarUrl: "https://i.pravatar.cc/150?u=kien-blog",
    bio: "Viết về những gì đang làm: Node.js, React, deploy production và các bài học từ dự án thực tế.",
  },
};

const prismaSnakeCaseContent: BlogPost["content"] = [
  {
    type: "paragraph",
    text: "Khi deploy Prisma lên VPS Linux, tôi từng gặp migration chạy OK trên Windows nhưng fail trên production vì tên bảng phân biệt hoa thường. Bài này ghi lại cách mình chuẩn hóa schema và tránh lỗi tương tự.",
  },
  {
    type: "heading",
    level: 2,
    id: "van-de",
    text: "Vấn đề thường gặp",
  },
  {
    type: "paragraph",
    text: "MariaDB trên Linux mặc định phân biệt tên bảng theo case. Migration tạo bảng User nhưng ALTER TABLE user sẽ trỏ sang bảng khác — hoặc báo không tồn tại. Prisma client vẫn query User và trả lỗi P2022.",
  },
  {
    type: "callout",
    variant: "note",
    title: "Ghi nhớ",
    text: "Luôn kiểm tra DESCRIBE trên VPS sau migrate deploy, không chỉ dựa vào prisma migrate status.",
  },
  {
    type: "heading",
    level: 2,
    id: "quy-uoc",
    text: "Quy ước snake_case + @map",
  },
  {
    type: "paragraph",
    text: "Giải pháp ổn định: giữ model PascalCase/camelCase trong Prisma schema, map xuống DB bằng @@map cho bảng và @map cho cột nhiều từ.",
  },
  {
    type: "code",
    language: "prisma",
    code: `model User {
  createdAt DateTime @default(now()) @map("created_at")
  @@map("user")
}`,
  },
  {
    type: "heading",
    level: 2,
    id: "workflow",
    text: "Workflow dev → production",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "Viết migration trên local, chạy migrate dev.",
      "Review SQL — đảm bảo tên bảng/cột thống nhất snake_case.",
      "Trên VPS: prisma migrate deploy (không dùng migrate dev).",
      "Seed hoặc kiểm tra API trước khi mở traffic.",
    ],
  },
  {
    type: "quote",
    text: "Schema drift là lỗi im lặng — API trả 400/500 generic trong khi log Prisma mới nói thật.",
    cite: "Kinh nghiệm từ lần deploy đầu",
  },
  {
    type: "heading",
    level: 3,
    id: "ket-luan",
    text: "Kết luận",
  },
  {
    type: "paragraph",
    text: "Một lần chuẩn hóa naming convention tiết kiệm nhiều giờ debug sau này. Nếu bạn đang setup monorepo Express + Prisma, nên quyết định convention ngay từ migration đầu tiên.",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "prisma-snake-case-mariadb-linux",
    title: "Prisma trên MariaDB Linux: tránh lỗi migration vì tên bảng",
    excerpt:
      "Case sensitivity khiến migration pass trên Windows nhưng fail trên VPS — cách dùng @@map và @map để schema ổn định.",
    coverUrl: "https://picsum.photos/seed/blog-prisma/1200/630",
    category: "backend",
    tags: ["Prisma", "MariaDB", "DevOps"],
    authorId: "kien",
    publishedAt: "2026-08-05T08:00:00.000Z",
    readMinutes: 6,
    featured: true,
    content: prismaSnakeCaseContent,
  },
  {
    id: "2",
    slug: "react-19-portfolio-architecture",
    title: "Kiến trúc portfolio React 19: tách section, data riêng, ship nhanh",
    excerpt:
      "Cách tổ chức trang chủ thành các section độc lập, mock data tách file và giữ banner/story không đụng chạm khi thêm feature.",
    coverUrl: "https://picsum.photos/seed/blog-react/1200/630",
    category: "frontend",
    tags: ["React", "TypeScript", "Architecture"],
    authorId: "kien",
    publishedAt: "2026-08-03T10:00:00.000Z",
    readMinutes: 8,
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "Portfolio không cần over-engineer ngay từ đầu. Mình chia Home thành NewsSection (giữ nguyên) + các block mới import riêng, mỗi block có file data riêng.",
      },
      {
        type: "heading",
        level: 2,
        id: "structure",
        text: "Cấu trúc thư mục",
      },
      {
        type: "list",
        items: [
          "pages/Home.tsx — orchestrator, không nhét UI dài.",
          "components/home/* — một section một file.",
          "data/homeContent.ts — copy, stats, FAQ tách khỏi JSX.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "Khi backend sẵn sàng, chỉ thay hook fetch — component UI giữ nguyên.",
      },
    ],
  },
  {
    id: "3",
    slug: "jwt-refresh-token-flow",
    title: "JWT access + refresh: flow axios interceptor gọn cho admin",
    excerpt:
      "Triển khai auth admin với refresh tự động, tránh loop 401 và clear token khi hết phiên.",
    coverUrl: "https://picsum.photos/seed/blog-jwt/1200/630",
    category: "backend",
    tags: ["JWT", "Express", "Security"],
    authorId: "kien",
    publishedAt: "2026-07-28T14:00:00.000Z",
    readMinutes: 10,
    content: [
      {
        type: "paragraph",
        text: "Access token ngắn hạn, refresh token lưu DB với expiresAt. Axios interceptor bắt 401, gọi /auth/refresh một lần (dedupe bằng promise shared), retry request gốc.",
      },
      {
        type: "heading",
        level: 2,
        id: "flow",
        text: "Luồng refresh",
      },
      {
        type: "code",
        language: "typescript",
        code: `if (status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;
  const token = await refreshAccessToken();
  originalRequest.headers.Authorization = \`Bearer \${token}\`;
  return api(originalRequest);
}`,
      },
    ],
  },
  {
    id: "4",
    slug: "deploy-express-vite-monorepo",
    title: "Deploy monorepo Express + Vite: build frontend vào backend/dist",
    excerpt:
      "Một server phục vụ API và SPA — cấu hình outDir, static middleware và fallback index.html.",
    coverUrl: "https://picsum.photos/seed/blog-deploy/1200/630",
    category: "devops",
    tags: ["Vite", "Express", "VPS"],
    authorId: "kien",
    publishedAt: "2026-07-20T09:00:00.000Z",
    readMinutes: 7,
    content: [
      {
        type: "paragraph",
        text: "vite.config outDir trỏ ../backend/dist. Express serve static trước, route GET cuối trả index.html cho client routing.",
      },
    ],
  },
  {
    id: "5",
    slug: "story-feature-24h-expiry",
    title: "Story 24h: filter expiresAt và seed data không bị 'mất' ngầm",
    excerpt:
      "API lọc story hết hạn là đúng — nhưng cần seed TTL dài hơn cho dev và empty state rõ trên UI.",
    coverUrl: "https://picsum.photos/seed/blog-story/1200/630",
    category: "tutorial",
    tags: ["React", "Prisma", "UX"],
    authorId: "kien",
    publishedAt: "2026-07-15T11:00:00.000Z",
    readMinutes: 5,
    content: [
      {
        type: "paragraph",
        text: "findMany với where expiresAt gt now() khiến story seed 24h biến mất sau một ngày. Dev nên seed 7 ngày và dùng URL media thật (picsum) thay domain giả.",
      },
    ],
  },
  {
    id: "6",
    slug: "resume-page-recruiter-brief",
    title: "Trang Resume cho nhà tuyển dụng: brief 30 giây, không marketing",
    excerpt:
      "Layout sidebar + section đánh số, văn phong fact-based thay vì buzzword — recruiter scan nhanh rồi quyết định email.",
    coverUrl: "https://picsum.photos/seed/blog-resume/1200/630",
    category: "career",
    tags: ["Career", "UX", "Portfolio"],
    authorId: "kien",
    publishedAt: "2026-07-10T08:00:00.000Z",
    readMinutes: 4,
    content: [
      {
        type: "paragraph",
        text: "Recruiter brief: timeline dự án, phạm vi kỹ thuật dạng bảng, CTA email một bước. Tránh card grid generic và câu tự quảng bá.",
      },
    ],
  },
  {
    id: "7",
    slug: "tailwind-design-tokens",
    title: "Design tokens với Tailwind 4: một nguồn màu và font",
    excerpt:
      ":root + @theme inline để brand orange, surface và typography đồng bộ toàn site.",
    coverUrl: "https://picsum.photos/seed/blog-tailwind/1200/630",
    category: "frontend",
    tags: ["Tailwind", "Design System"],
    authorId: "kien",
    publishedAt: "2026-07-01T10:00:00.000Z",
    readMinutes: 5,
    content: [
      {
        type: "paragraph",
        text: "Be Vietnam Pro làm font duy nhất. Token --color-brand map sang utility bg-brand, text-brand — sửa một chỗ, cả site đổi theo.",
      },
    ],
  },
  {
    id: "8",
    slug: "booking-race-condition-wallet",
    title: "Race condition ví hoàn tiền: SELECT FOR UPDATE trong transaction",
    excerpt:
      "Khi hai request cùng rút ví, cần lock row — ghi chú ngắn từ dự án booking đa chi nhánh.",
    coverUrl: "https://picsum.photos/seed/blog-wallet/1200/630",
    category: "backend",
    tags: ["MySQL", "Transaction", "Payment"],
    authorId: "kien",
    publishedAt: "2026-06-22T13:00:00.000Z",
    readMinutes: 9,
    content: [
      {
        type: "paragraph",
        text: "Bắt đầu transaction, SELECT balance FOR UPDATE, kiểm tra số dư, cập nhật, commit. Rollback nếu không đủ tiền — tránh double-spend khi callback payment song song.",
      },
    ],
  },
];

export function getBlogAuthor(authorId: string) {
  return BLOG_AUTHORS[authorId];
}
