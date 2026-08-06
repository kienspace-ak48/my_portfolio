import type { FeedPost, FeedPromo } from "../types/newsFeed";

export const feedPosts: FeedPost[] = [
  {
    id: "1",
    author: {
      name: "Mona Academy",
      avatar: "https://i.pravatar.cc/150?u=mona-academy",
      category: "Phát triển ứng dụng",
    },
    publishedAt: "2026-08-04T09:00:00.000Z",
    title: "Lộ trình học lập trình web cho người mới bắt đầu năm 2026",
    excerpt:
      "Bạn muốn bắt đầu sự nghiệp lập trình nhưng chưa biết nên học gì trước? Lộ trình dưới đây giúp bạn đi từ HTML/CSS cơ bản đến React, Node.js và triển khai dự án thực tế trong 6 tháng.",
    bullets: [
      { label: "HTML, CSS & Responsive Design", href: "#" },
      { label: "JavaScript ES6+ và TypeScript", href: "#" },
      { label: "React + Vite + Tailwind CSS", href: "#" },
      { label: "Node.js, Express, Prisma, MySQL", href: "#" },
    ],
    imageUrl: "https://picsum.photos/960/480?feed1",
    cta: { label: "Xem lộ trình chi tiết", href: "#" },
  },
  {
    id: "2",
    author: {
      name: "DevMarket Team",
      avatar: "https://i.pravatar.cc/150?u=devmarket",
      category: "Sản phẩm",
    },
    publishedAt: "2026-08-03T14:30:00.000Z",
    title: "Ra mắt giao diện chat realtime cho ứng dụng di động",
    excerpt:
      "Phiên bản mới hỗ trợ dark mode, gửi ảnh, reaction và thông báo đẩy. Giao diện được tối ưu cho cả iOS lẫn Android với trải nghiệm mượt trên thiết bị cấu hình thấp.",
    imageUrl: "https://picsum.photos/960/520?feed2",
    cta: { label: "Xem demo sản phẩm", href: "#" },
  },
  {
    id: "3",
    author: {
      name: "Kiên Vũ",
      avatar: "https://i.pravatar.cc/150?u=kien",
      category: "Chia sẻ kinh nghiệm",
    },
    publishedAt: "2026-08-02T08:15:00.000Z",
    title: "5 lỗi thường gặp khi deploy Node.js lên production",
    excerpt:
      "Từ quên set biến môi trường, CORS sai cấu hình, đến không migrate database trước khi release — đây là những sai lầm mình từng mắc và cách khắc phục nhanh.",
    bullets: [
      { label: "Thiếu health check endpoint", href: "#" },
      { label: "JWT secret hardcode trong code", href: "#" },
      { label: "Upload file không giới hạn dung lượng", href: "#" },
    ],
    imageUrl: "https://picsum.photos/960/460?feed3",
    cta: { label: "Đọc bài viết đầy đủ", href: "#" },
  },
  {
    id: "4",
    author: {
      name: "Frontend Việt",
      avatar: "https://i.pravatar.cc/150?u=frontend-vn",
      category: "React & UI",
    },
    publishedAt: "2026-08-01T16:45:00.000Z",
    title: "Xây dựng Story Viewer giống Instagram bằng React",
    excerpt:
      "Hướng dẫn nhóm story theo user, progress bar từng segment, pause/play, carousel preview hai bên và auto-advance — tất cả với React hooks và Tailwind CSS.",
    imageUrl: "https://picsum.photos/960/500?feed4",
    cta: { label: "Học thử miễn phí", href: "#" },
  },
];

export const feedPromos: FeedPromo[] = [
  {
    id: "p1",
    imageUrl: "https://picsum.photos/280/160?promo1",
    href: "#",
    alt: "Khóa học React nâng cao",
  },
  {
    id: "p2",
    imageUrl: "https://picsum.photos/280/160?promo2",
    href: "#",
    alt: "Tuyển dụng developer",
  },
  {
    id: "p3",
    imageUrl: "https://picsum.photos/280/160?promo3",
    href: "#",
    alt: "Workshop Node.js",
  },
  // {
  //   id: "p4",
  //   imageUrl: "https://picsum.photos/280/160?promo4",
  //   href: "#",
  //   alt: "Ưu đãi hosting",
  // },
];

export function formatFeedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
