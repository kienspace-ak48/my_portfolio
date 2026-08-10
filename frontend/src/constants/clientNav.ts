import { Home, Megaphone, Newspaper, FileUser, BookOpen, type LucideIcon } from "lucide-react";

export type ClientNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Dùng cho NavLink `end` — match exact path */
  end?: boolean;
};

/** Nav chính client — dùng chung Sidebar, BottomNav, mobile menu */
export const CLIENT_NAV: ClientNavItem[] = [
  { to: "/", label: "Trang chủ", icon: Home, end: true },
  { to: "/resume", label: "Resume", icon: FileUser },
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/projects", label: "Dự án", icon: Newspaper },
  { to: "/news", label: "Bản tin", icon: Megaphone },
];

export const SEARCH_PLACEHOLDER = "Tìm kiếm source code, đồ án...";
