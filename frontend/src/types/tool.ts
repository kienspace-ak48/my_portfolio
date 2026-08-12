import type { LucideIcon } from "lucide-react";

export type ToolMeta = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Xử lý hoàn toàn trên trình duyệt */
  clientSide?: boolean;
};
