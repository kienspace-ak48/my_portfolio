export type FooterLink = {
  label: string;
  to: string;
  external?: boolean;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const FOOTER_TAGLINE = "Chia sẻ dự án · Công cụ · Kiến thức lập trình";

export const FOOTER_CONTACT = {
  email: "kien.dev@gmail.com",
  github: "https://github.com/kien",
  location: "Việt Nam",
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Về Kien's Space",
    links: [
      { label: "Giới thiệu", to: "/" },
      { label: "Dự án của tôi", to: "/projects" },
      { label: "Bản tin dev", to: "/news" },
      { label: "Liên hệ", to: "mailto:kien.dev@gmail.com", external: true },
    ],
  },
  {
    title: "Nội dung",
    links: [
      { label: "Dự án nổi bật", to: "/projects" },
      { label: "Stories & cập nhật", to: "/news" },
      { label: "Gallery", to: "/projects" },
      { label: "Source code mở", to: "https://github.com/kien", external: true },
    ],
  },
  {
    title: "Công cụ",
    links: [
      { label: "JSON Formatter", to: "#" },
      { label: "Regex Tester", to: "#" },
      { label: "Base64 Encode/Decode", to: "#" },
      { label: "CSS Gradient Generator", to: "#" },
      { label: "Snippet Generator", to: "#" },
    ],
  },
];

export const FOOTER_SOCIAL = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/kien",
    color: "#e5e7eb",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com",
    color: "#ef4444",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    color: "#3b82f6",
  },
] as const;
