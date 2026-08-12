import type {
  ResumeContact,
  ResumeExperience,
  ResumeProfile,
  ResumeQuickFact,
  ResumeScope,
  ResumeSkillGroup,
  ResumeSnapshot,
} from "../types/resume";

export type {
  ResumeContact,
  ResumeExperience,
  ResumeProfile,
  ResumeQuickFact,
  ResumeScope,
  ResumeSkillGroup,
  ResumeSnapshot,
} from "../types/resume";

export { RESUME_SECTIONS } from "../types/resume";

export const RESUME_PROFILE: ResumeProfile = {
  name: "Vũ Văn Kiên",
  title: "Fullstack Developer",
  focus: "Node.js · React · TypeScript",
  availability: "Có thể trao đổi từ Q3/2026",
  avatarUrl: "https://i.pravatar.cc/300?u=kien-resume",
  intro:
    "Tôi làm web app end-to-end: thiết kế API và database, dựng giao diện React, rồi deploy lên môi trường thật. Quen làm việc một mình hoặc trong team nhỏ, ưu tiên deliverable rõ ràng hơn slide trình bày dài.",
  preferencesIntro:
    "Nếu role của bạn gần với các mục dưới, bạn có thể gửi email kèm mô tả ngắn về team, stack và timeline.",
  preferences: [
    "Vị trí Fullstack hoặc Backend (Node.js, TypeScript)",
    "Sản phẩm web B2B, SaaS hoặc nội bộ doanh nghiệp",
    "Remote hoặc hybrid — base tại Việt Nam (UTC+7)",
    "Team có spec/roadmap rõ, review code định kỳ",
  ],
};

export const RESUME_CONTACT: ResumeContact = {
  email: "kien.dev@gmail.com",
  github: "https://github.com/kien",
  githubLabel: "github.com/kien",
  location: "Việt Nam · UTC+7",
  responseTime: "Thường phản hồi trong 1 ngày làm việc",
};

export const RESUME_QUICK_FACTS: ResumeQuickFact[] = [
  { label: "Vai trò", value: "Fullstack Developer" },
  { label: "Kinh nghiệm", value: "~1 năm (dự án thực tế + cá nhân)" },
  { label: "Hình thức", value: "Full-time · Freelance dài hạn" },
  { label: "Ngôn ngữ", value: "Tiếng Việt · Tiếng Anh đọc tài liệu" },
];

export const RESUME_SNAPSHOT: ResumeSnapshot[] = [
  { value: "3", label: "dự án chính có demo" },
  { value: "Node", label: "backend chính" },
  { value: "React", label: "frontend chính" },
  { value: "VPS", label: "đã deploy production" },
];

export const RESUME_SCOPE: ResumeScope[] = [
  {
    id: "api",
    area: "Backend & API",
    detail:
      "REST với Express, Prisma ORM, auth JWT (access/refresh), phân quyền cơ bản, upload media.",
  },
  {
    id: "ui",
    area: "Frontend",
    detail:
      "React + TypeScript, routing, form admin, responsive mobile, tích hợp API qua axios.",
  },
  {
    id: "data",
    area: "Database",
    detail:
      "MariaDB/MySQL — schema migration với Prisma, quy ước snake_case cho tương thích Linux.",
  },
  {
    id: "ops",
    area: "Triển khai",
    detail:
      "Build SPA, serve static qua Express, cấu hình Nginx/PM2 trên VPS, env production.",
  },
];

export const RESUME_EXPERIENCE: ResumeExperience[] = [
  {
    id: "devmarket",
    period: "2025 — nay",
    role: "Fullstack Developer",
    company: "DevMarket",
    context: "Marketplace source code — portfolio cá nhân đang mở rộng thành sản phẩm.",
    bullets: [
      "API quản lý project, story, user; admin dashboard React.",
      "Auth JWT, refresh token, CRUD có phân quyền admin.",
      "Trang public: featured projects, story 24h, build deploy lên VPS.",
    ],
    tags: ["Node.js", "React", "Prisma", "MariaDB"],
    projectHref: "/projects",
  },
  {
    id: "cherry",
    period: "2024 — 2025",
    role: "Backend Developer",
    company: "Cherry House",
    context: "Nền tảng đặt phòng đa chi nhánh cho chuỗi lưu trú.",
    bullets: [
      "Model Brand → Property → Branch → Room → Booking.",
      "Tích hợp cổng thanh toán VNPay/MoMo.",
      "Xử lý ví hoàn tiền — lock row khi cập nhật số dư.",
    ],
    tags: ["Express", "MySQL", "Payment"],
  },
  {
    id: "accessrace",
    period: "2024",
    role: "Backend Developer",
    company: "AccessRace",
    context: "Check-in sự kiện bằng QR cho ban tổ chức và khách tham dự.",
    bullets: [
      "JWT + RBAC theo vai trò organizer/staff/attendee.",
      "Gửi email qua SendGrid, hàng đợi job với BullMQ.",
    ],
    tags: ["Node.js", "BullMQ", "SendGrid"],
  },
];

export const RESUME_SKILL_GROUPS: ResumeSkillGroup[] = [
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "Express", "Prisma", "MariaDB", "JWT", "REST"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "TypeScript", "Vite", "Tailwind", "React Router"],
  },
  {
    id: "tools",
    label: "Khác",
    items: ["Git", "Linux VPS", "Nginx", "PM2", "Cloudinary", "pnpm"],
  },
];
