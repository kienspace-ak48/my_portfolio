import { Binary, Globe, KeyRound, Mail, Tags } from "lucide-react";
import type { ToolMeta } from "../types/tool";

export const TOOLS_CATALOG: ToolMeta[] = [
  {
    slug: "base64",
    title: "Mã hóa / Giải mã Base64",
    description:
      "Chuyển đổi văn bản sang Base64 và ngược lại. Xử lý hoàn toàn trên trình duyệt.",
    icon: Binary,
    clientSide: true,
  },
  {
    slug: "ip",
    title: "IP của tôi là gì?",
    description:
      "Kiểm tra địa chỉ IP công khai, nhà mạng và thông tin vị trí ước lượng.",
    icon: Globe,
  },
  {
    slug: "password",
    title: "Tạo mật khẩu",
    description:
      "Sinh mật khẩu ngẫu nhiên mạnh với độ dài và ký tự tùy chỉnh.",
    icon: KeyRound,
    clientSide: true,
  },
  {
    slug: "meta-tag",
    title: "Meta Tag Generator",
    description:
      "Sinh meta SEO, Open Graph (Facebook, LinkedIn) và Twitter/X Card kèm preview.",
    icon: Tags,
    clientSide: true,
  },
  {
    slug: "email-signature",
    title: "Tạo chữ ký email",
    description:
      "Tạo chữ ký email HTML chuyên nghiệp — preview trực tiếp, copy dán vào Gmail hoặc Outlook.",
    icon: Mail,
    clientSide: true,
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS_CATALOG.find((tool) => tool.slug === slug);
}
