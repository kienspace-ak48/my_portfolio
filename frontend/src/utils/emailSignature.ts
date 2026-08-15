export type SignatureFont =
  | "Arial, Helvetica, sans-serif"
  | "Georgia, serif"
  | "Verdana, Geneva, sans-serif"
  | "'Trebuchet MS', Helvetica, sans-serif"
  | "Tahoma, Geneva, sans-serif";

export type CustomSignatureLink = {
  id: string;
  label: string;
  url: string;
};

export type EmailSignatureForm = {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  mobile: string;
  website: string;
  photoUrl: string;
  logoUrl: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: SignatureFont;
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
  github: string;
  customLinks: CustomSignatureLink[];
};

export function newCustomSignatureLink(): CustomSignatureLink {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: "",
    url: "",
  };
}

export const SIGNATURE_FONT_OPTIONS: { value: SignatureFont; label: string }[] = [
  { value: "Arial, Helvetica, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Verdana, Geneva, sans-serif", label: "Verdana" },
  { value: "'Trebuchet MS', Helvetica, sans-serif", label: "Trebuchet MS" },
  { value: "Tahoma, Geneva, sans-serif", label: "Tahoma" },
];

export const DEFAULT_EMAIL_SIGNATURE_FORM: EmailSignatureForm = {
  name: "Vũ Văn Kiên",
  title: "Fullstack Developer",
  company: "Kien's Space",
  email: "kien.dev@gmail.com",
  phone: "",
  mobile: "",
  website: "https://kienvu.id.vn",
  photoUrl: "",
  logoUrl: "",
  accentColor: "#6366f1",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  fontFamily: "Arial, Helvetica, sans-serif",
  linkedin: "",
  facebook: "",
  twitter: "",
  instagram: "",
  github: "",
  customLinks: [],
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^mailto:/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function safeHexColor(value: string, fallback: string): string {
  return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : fallback;
}

function linkHtml(href: string, label: string, color = "#2563eb"): string {
  const trimmed = href.trim();
  if (!trimmed) return escapeHtml(label);
  const url = normalizeUrl(trimmed);
  return `<a href="${escapeHtml(url)}" style="color:${color};text-decoration:none;" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function socialPill(url: string, label: string, bg: string): string {
  const normalized = normalizeUrl(url);
  if (!normalized) return "";
  return `<a href="${escapeHtml(normalized)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 6px 4px 0;text-decoration:none;font-size:11px;font-weight:700;color:#ffffff;background:${bg};border-radius:999px;padding:4px 10px;line-height:1;">${escapeHtml(label)}</a>`;
}

type ContactIconType = "email" | "phone" | "mobile" | "website";

/** PNG icons via Icons8 CDN — Gmail/Outlook require absolute HTTPS URLs (not data: URI). */
const CONTACT_ICON_SLUGS: Record<ContactIconType, string> = {
  email: "new-post",
  phone: "phone",
  mobile: "cell-phone",
  website: "globe--v1",
};

function contactIconUrl(type: ContactIconType, accentColor: string): string {
  const color = safeHexColor(accentColor, "#6366f1").slice(1);
  const slug = CONTACT_ICON_SLUGS[type];
  return `https://img.icons8.com/ios-glyphs/30/${color}/${slug}.png`;
}

function contactRow(
  iconType: ContactIconType,
  iconColor: string,
  content: string,
  rowStyle: string,
): string {
  const iconSrc = escapeHtml(contactIconUrl(iconType, iconColor));
  return `<tr><td style="${rowStyle}">
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td style="width:20px;padding:0 8px 0 0;vertical-align:middle;line-height:0;">
          <img src="${iconSrc}" width="14" height="14" alt="" style="display:block;border:0;outline:none;" />
        </td>
        <td style="vertical-align:middle;">${content}</td>
      </tr>
    </table>
  </td></tr>`;
}

function subtitleLines(title: string, company: string, font: string, mutedColor: string): string {
  const rows: string[] = [];
  if (title) {
    rows.push(
      `<tr><td style="font-family:${font};font-size:13px;color:${mutedColor};line-height:1.4;padding:0 0 2px 0;">${title}</td></tr>`,
    );
  }
  if (company) {
    rows.push(
      `<tr><td style="font-family:${font};font-size:13px;color:${mutedColor};line-height:1.4;padding:0 0 6px 0;">${company}</td></tr>`,
    );
  } else if (title) {
    rows[rows.length - 1] = rows[rows.length - 1]!.replace("padding:0 0 2px 0", "padding:0 0 6px 0");
  }
  return rows.join("");
}

export function buildEmailSignatureHtml(form: EmailSignatureForm): string {
  const name = escapeHtml(form.name.trim() || "Your Name");
  const font = form.fontFamily || "Arial, Helvetica, sans-serif";
  const accent = safeHexColor(form.accentColor, "#6366f1");
  const textColor = safeHexColor(form.textColor, "#0f172a");
  const mutedColor = "#64748b";
  const bodyColor = "#475569";
  const bg = safeHexColor(form.backgroundColor, "#ffffff");
  const linkColor = accent;
  const iconColor = accent;

  const titleHtml = escapeHtml(form.title.trim());
  const companyHtml = escapeHtml(form.company.trim());
  const imageUrl = form.photoUrl.trim() || form.logoUrl.trim();

  const imageCell = imageUrl
    ? `<td style="padding:0 12px 0 0;vertical-align:top;">
        <img src="${escapeHtml(imageUrl)}" alt="${name}" width="64" height="64" style="display:block;width:64px;height:64px;border-radius:10px;object-fit:cover;border:0;" />
      </td>`
    : "";

  const contactRows: string[] = [];
  const rowStyle = `padding:1px 0;font-family:${font};font-size:13px;color:${bodyColor};line-height:1.55;`;

  if (form.email.trim()) {
    contactRows.push(
      contactRow(
        "email",
        iconColor,
        linkHtml(`mailto:${form.email.trim()}`, form.email.trim(), linkColor),
        rowStyle,
      ),
    );
  }
  if (form.phone.trim()) {
    contactRows.push(
      contactRow("phone", iconColor, escapeHtml(form.phone.trim()), rowStyle),
    );
  }
  if (form.mobile.trim()) {
    contactRows.push(
      contactRow("mobile", iconColor, escapeHtml(form.mobile.trim()), rowStyle),
    );
  }
  if (form.website.trim()) {
    const siteLabel = form.website.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    contactRows.push(
      contactRow(
        "website",
        iconColor,
        linkHtml(form.website.trim(), siteLabel, linkColor),
        rowStyle,
      ),
    );
  }

  const socials = [
    socialPill(form.linkedin, "LinkedIn", "#0A66C2"),
    socialPill(form.twitter, "X", "#111827"),
    socialPill(form.facebook, "Facebook", "#1877F2"),
    socialPill(form.instagram, "Instagram", "#E4405F"),
    socialPill(form.github, "GitHub", "#24292f"),
    ...form.customLinks
      .filter((link) => link.label.trim() && link.url.trim())
      .map((link) => socialPill(link.url, link.label.trim(), accent)),
  ].filter(Boolean);

  const socialRow = socials.length
    ? `<tr><td style="padding-top:8px;">${socials.join("")}</td></tr>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;background:${bg};">
  <tr>
    <td style="padding:12px;background:${bg};">
      <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
        <tr>
          ${imageCell}
          <td style="border-left:3px solid ${accent};padding:0 0 0 12px;vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
              <tr>
                <td style="font-family:${font};font-size:16px;font-weight:700;color:${textColor};line-height:1.3;padding:0 0 2px 0;">${name}</td>
              </tr>
              ${
                titleHtml || companyHtml
                  ? subtitleLines(titleHtml, companyHtml, font, mutedColor)
                  : ""
              }
              ${contactRows.join("")}
              ${socialRow}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function buildEmailSignaturePlainText(form: EmailSignatureForm): string {
  const lines: string[] = [];
  if (form.name.trim()) lines.push(form.name.trim());
  if (form.title.trim()) lines.push(form.title.trim());
  if (form.company.trim()) lines.push(form.company.trim());
  if (form.email.trim()) lines.push(form.email.trim());
  if (form.phone.trim()) lines.push(form.phone.trim());
  if (form.mobile.trim()) lines.push(form.mobile.trim());
  if (form.website.trim()) lines.push(form.website.trim());
  const socials = [
    form.linkedin.trim() && `LinkedIn: ${form.linkedin.trim()}`,
    form.twitter.trim() && `X: ${form.twitter.trim()}`,
    form.facebook.trim() && `Facebook: ${form.facebook.trim()}`,
    form.instagram.trim() && `Instagram: ${form.instagram.trim()}`,
    form.github.trim() && `GitHub: ${form.github.trim()}`,
    ...form.customLinks
      .filter((link) => link.label.trim() && link.url.trim())
      .map((link) => `${link.label.trim()}: ${link.url.trim()}`),
  ].filter(Boolean) as string[];
  if (socials.length) lines.push(socials.join(" · "));
  return lines.join("\n");
}

export type InstallGuideItem = {
  id: string;
  title: string;
  steps: string[];
};

export const SIGNATURE_INSTALL_GUIDES: InstallGuideItem[] = [
  {
    id: "gmail",
    title: "Gmail",
    steps: [
      "Copy chữ ký bằng nút «Copy chữ ký».",
      "Mở Gmail → biểu tượng bánh răng → «Xem tất cả cài đặt».",
      "Tab «Chung» → kéo xuống «Chữ ký» → «Tạo mới».",
      "Đặt tên chữ ký → dán (Ctrl+V) vào khung soạn thảo.",
      "Chọn chữ ký mặc định cho email mới và trả lời.",
      "Cuộn xuống cuối → «Lưu thay đổi».",
    ],
  },
  {
    id: "outlook",
    title: "Outlook (Desktop & Web)",
    steps: [
      "Copy chữ ký HTML hoặc dùng «Copy chữ ký».",
      "Outlook Web: Cài đặt → «Mail» → «Compose and reply» → «Email signature».",
      "Outlook Desktop: File → Options → Mail → Signatures.",
      "Dán chữ ký vào editor → Save.",
    ],
  },
  {
    id: "apple",
    title: "Apple Mail",
    steps: [
      "Copy chữ ký bằng «Copy chữ ký».",
      "Mail → Settings → Signatures → chọn account → «+».",
      "Dán vào khung chữ ký → bỏ tick «Always match my default message font» nếu bị lệch font.",
    ],
  },
  {
    id: "yahoo",
    title: "Yahoo Mail",
    steps: [
      "Copy chữ ký → Yahoo Settings → «More Settings» → «Writing email».",
      "Bật signature → dán vào ô soạn thảo → Save.",
    ],
  },
  {
    id: "thunderbird",
    title: "Thunderbird",
    steps: [
      "Account Settings → chọn identity → tick «HTML».",
      "Dán HTML từ «Copy HTML» hoặc paste rich từ «Copy chữ ký».",
      "OK để lưu.",
    ],
  },
];
