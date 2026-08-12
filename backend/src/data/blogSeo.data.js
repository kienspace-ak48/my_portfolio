/** Metadata blog tĩnh — mirror frontend/src/data/blogPosts.ts cho SSR SEO */
const BLOG_SEO_POSTS = [
  {
    slug: "prisma-snake-case-mariadb-linux",
    title: "Prisma trên MariaDB Linux: tránh lỗi migration vì tên bảng",
    excerpt:
      "Chuẩn hóa snake_case với @@map/@map và workflow migrate dev → production không bị lệch schema.",
    coverUrl: "https://picsum.photos/seed/blog-prisma/1200/630",
    authorName: "Vũ Văn Kiên",
  },
  {
    slug: "react-19-portfolio-architecture",
    title: "Kiến trúc portfolio React 19: tách section, data riêng, ship nhanh",
    excerpt:
      "Cách tổ chức page/component/data để thêm tính năng mà không phình App.tsx.",
    coverUrl: "https://picsum.photos/seed/blog-react/1200/630",
    authorName: "Vũ Văn Kiên",
  },
  {
    slug: "jwt-refresh-token-flow",
    title: "JWT access + refresh: flow axios interceptor gọn cho admin",
    excerpt:
      "Refresh token httpOnly, queue request khi access hết hạn, logout an toàn.",
    coverUrl: "https://picsum.photos/seed/blog-jwt/1200/630",
    authorName: "Vũ Văn Kiên",
  },
  {
    slug: "deploy-express-vite-monorepo",
    title: "Deploy monorepo Express + Vite: build frontend vào backend/dist",
    excerpt:
      "Một process Node phục vụ API + static SPA, env production và Nginx reverse proxy.",
    coverUrl: "https://picsum.photos/seed/blog-deploy/1200/630",
    authorName: "Vũ Văn Kiên",
  },
  {
    slug: "story-feature-24h-expiry",
    title: "Story 24h: filter expiresAt và seed data không bị 'mất' ngầm",
    excerpt:
      "Cron/filter query stories còn hạn và UX upload admin.",
    coverUrl: "https://picsum.photos/seed/blog-story/1200/630",
    authorName: "Vũ Văn Kiên",
  },
  {
    slug: "resume-page-recruiter-brief",
    title: "Trang Resume cho nhà tuyển dụng: brief 30 giây, không marketing",
    excerpt:
      "Thông tin recruiter cần trong 30 giây: scope, stack, availability.",
    coverUrl: "https://picsum.photos/seed/blog-resume/1200/630",
    authorName: "Vũ Văn Kiên",
  },
  {
    slug: "tailwind-design-tokens",
    title: "Design tokens với Tailwind 4: một nguồn màu và font",
    excerpt:
      "CSS variables + @theme thay vì hardcode màu rải rác component.",
    coverUrl: "https://picsum.photos/seed/blog-tailwind/1200/630",
    authorName: "Vũ Văn Kiên",
  },
  {
    slug: "booking-race-condition-wallet",
    title: "Race condition ví hoàn tiền: SELECT FOR UPDATE trong transaction",
    excerpt:
      "Pessimistic lock khi cộng/trừ balance để tránh double spend.",
    coverUrl: "https://picsum.photos/seed/blog-wallet/1200/630",
    authorName: "Vũ Văn Kiên",
  },
];

function findBlogSeoBySlug(slug) {
  return BLOG_SEO_POSTS.find((post) => post.slug === slug) ?? null;
}

function listBlogSeoSlugs() {
  return BLOG_SEO_POSTS.map((post) => post.slug);
}

module.exports = {
  BLOG_SEO_POSTS,
  findBlogSeoBySlug,
  listBlogSeoSlugs,
};
