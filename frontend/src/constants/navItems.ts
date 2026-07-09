import { Home, Compass, Folder, Heart, Settings } from "lucide-react";
import type { NavItem } from "../types/nav";

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Trang chủ", path: "-/trang-chu", icon: Home },
  { id: "explore", label: "Khám phá", path: "-/kham-pha", icon: Compass },
  { id: "projects", label: "Dự án", path: "-/du-an", icon: Folder },
  { id: "about", label: "Giới thiệu", path: "-/gioi-thieu", icon: Heart },
  { id: "setting", label: "Cài đặt", path: "-/cai-dat", icon: Settings },
];

export const SEARCH_PLACEHOLDER = "Tìm kiếm source code, đồ án...";
