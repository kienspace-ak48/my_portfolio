import type { LucideIcon } from "lucide-react";
import {
  Bot,
  LayoutGrid,
  Monitor,
  ShoppingCart,
  Smartphone,
} from "lucide-react";

export type DiscoveryCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
};

export type HomeStat = {
  value: string;
  label: string;
};

export type TechItem = {
  id: string;
  name: string;
  iconUrl: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const DISCOVERY_CATEGORIES: DiscoveryCategory[] = [
  { id: "web", label: "Web app", icon: Monitor, href: "/projects" },
  { id: "mobile", label: "Mobile", icon: Smartphone, href: "/projects" },
  { id: "ai", label: "AI / Bot", icon: Bot, href: "/projects" },
  { id: "admin", label: "Admin", icon: LayoutGrid, href: "/projects" },
  {
    id: "ecommerce",
    label: "E-commerce",
    icon: ShoppingCart,
    href: "/projects",
  },
];

export const HOME_STATS: HomeStat[] = [
  { value: "1+", label: "Năm kinh nghiệm" },
  { value: "6+", label: "Dự án cá nhân" },
  { value: "10+", label: "Công nghệ sử dụng" },
  { value: "2+", label: "Dự án nổi bật" },
];

export const TECH_STACK: TechItem[] = [
  {
    id: "nodejs",
    name: "Node.js",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    id: "react",
    name: "React",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    id: "typescript",
    name: "TypeScript",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    id: "express",
    name: "Express",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
  {
    id: "prisma",
    name: "Prisma",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
  },
  {
    id: "mariadb",
    name: "MariaDB",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
];

export const HOME_FAQS: FaqItem[] = [
  {
    id: "work-type",
    question: "Bạn đang làm việc theo hình thức freelance hay full-time?",
    answer:
      "Hiện tại tôi ưu tiên các cơ hội full-time hoặc hợp tác dài hạn, đồng thời nhận freelance cho dự án web app có phạm vi rõ ràng và timeline hợp lý.",
  },
  {
    id: "deploy",
    question: "Bạn có thể triển khai (deploy) dự án lên server thật không?",
    answer:
      "Có. Tôi có kinh nghiệm deploy lên VPS Linux (Nginx, PM2, MariaDB), cấu hình domain, SSL và CI/CD cơ bản cho môi trường production.",
  },
  {
    id: "response",
    question: "Thời gian phản hồi trung bình khi liên hệ là bao lâu?",
    answer:
      "Thường phản hồi trong vòng 24 giờ làm việc. Với tin nhắn khẩn liên quan dự án đang chạy, tôi cố gắng phản hồi sớm hơn trong cùng ngày.",
  },
  {
    id: "demo",
    question: "Bạn có source code demo để xem trước không?",
    answer:
      "Có. Các dự án nổi bật trên trang chủ đều có link Demo và GitHub (nếu public). Bạn cũng có thể xem thêm trong mục Dự án.",
  },
];
