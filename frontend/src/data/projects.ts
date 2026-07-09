export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  badge: string;
  image: string;
  tags: string[];
  year: string;
  status: "completed" | "in-progress" | "archived";
  demoUrl?: string;
  repoUrl?: string;
  features: string[];
};

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "devmarket",
    title: "DevMarket Platform",
    description:
      "Nền tảng chia sẻ source code và đồ án với tìm kiếm, phân loại và hồ sơ người dùng.",
    longDescription:
      "DevMarket là nền tảng marketplace dành cho developer Việt Nam, nơi chia sẻ source code, template và đồ án thực tế. Hệ thống hỗ trợ tìm kiếm full-text, lọc theo tech stack, đánh giá và bình luận từ cộng đồng.",
    badge: "Full-stack",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    tags: ["React", "Node.js", "MongoDB", "Tailwind"],
    year: "2025",
    status: "in-progress",
    demoUrl: "#",
    repoUrl: "#",
    features: [
      "Tìm kiếm và lọc dự án theo ngôn ngữ, framework",
      "Hồ sơ người dùng với portfolio tích hợp",
      "Upload và preview source code trực tiếp",
      "Hệ thống đánh giá sao và bình luận",
    ],
  },
  {
    id: "taskflow",
    title: "TaskFlow Manager",
    description:
      "Ứng dụng quản lý công việc theo Kanban, hỗ trợ kéo thả, deadline và thông báo realtime.",
    longDescription:
      "TaskFlow giúp team nhỏ quản lý sprint và task hàng ngày với giao diện Kanban trực quan. Ứng dụng tối ưu cho remote work, đồng bộ trạng thái task theo thời gian thực qua WebSocket.",
    badge: "React",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&q=80",
    tags: ["React", "TypeScript", "Socket.io", "PostgreSQL"],
    year: "2024",
    status: "completed",
    demoUrl: "#",
    repoUrl: "#",
    features: [
      "Board Kanban kéo thả mượt mà",
      "Nhắc deadline qua email và in-app",
      "Phân công task và theo dõi tiến độ",
      "Lịch sử thay đổi từng thẻ công việc",
    ],
  },
  {
    id: "blog-api",
    title: "Blog REST API",
    description:
      "Backend API cho blog với JWT auth, CRUD bài viết, upload ảnh và phân quyền admin.",
    longDescription:
      "Blog REST API là backend production-ready cho CMS cá nhân hoặc blog team. Thiết kế RESTful chuẩn, tài liệu Swagger đầy đủ, middleware bảo mật và rate limiting sẵn sàng deploy.",
    badge: "Node.js",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    tags: ["Express", "JWT", "MongoDB", "Swagger"],
    year: "2024",
    status: "completed",
    demoUrl: "#",
    repoUrl: "#",
    features: [
      "JWT authentication & refresh token",
      "CRUD bài viết, tag, category",
      "Upload ảnh qua Cloudinary",
      "Phân quyền admin / editor / reader",
    ],
  },
  {
    id: "weather-dash",
    title: "Weather Dashboard",
    description:
      "Dashboard thời tiết trực quan, dự báo 7 ngày và biểu đồ nhiệt độ theo giờ.",
    longDescription:
      "Weather Dashboard tổng hợp dữ liệu từ OpenWeather API, hiển thị thời tiết hiện tại, dự báo tuần và biểu đồ nhiệt độ/độ ẩm. Hỗ trợ lưu nhiều thành phố yêu thích.",
    badge: "TypeScript",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f932b08?w=1200&q=80",
    tags: ["TypeScript", "Chart.js", "OpenWeather API"],
    year: "2023",
    status: "completed",
    demoUrl: "#",
    repoUrl: "#",
    features: [
      "Dự báo 7 ngày với icon thời tiết",
      "Biểu đồ nhiệt độ và độ ẩm 24h",
      "Lưu danh sách thành phố yêu thích",
      "Dark mode tự động theo hệ thống",
    ],
  },
  {
    id: "portfolio-spa",
    title: "Portfolio SPA",
    description:
      "Website portfolio cá nhân tối ưu SEO, dark mode và animation mượt với React + Vite.",
    longDescription:
      "Portfolio SPA là website giới thiệu bản thân tối ưu performance với Vite, lazy loading section và meta tag SEO. Layout responsive, animation nhẹ và form liên hệ tích hợp.",
    badge: "Vite",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    tags: ["React", "Vite", "Tailwind", "Framer Motion"],
    year: "2025",
    status: "in-progress",
    demoUrl: "#",
    repoUrl: "#",
    features: [
      "Single Page App với routing mượt",
      "SEO meta tags và Open Graph",
      "Section projects, skills, contact",
      "Deploy static trên shared hosting",
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return SAMPLE_PROJECTS.find((project) => project.id === id);
}
