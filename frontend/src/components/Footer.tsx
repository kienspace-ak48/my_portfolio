import { Link } from "react-router-dom";
import BrandIcon from "./layout/BrandIcon";
import {
  FOOTER_COLUMNS,
  FOOTER_CONTACT,
  FOOTER_SOCIAL,
  FOOTER_TAGLINE,
  type FooterLink,
} from "../constants/footerLinks";

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className =
    "text-sm text-footer-muted transition-colors hover:text-white";

  if (link.external || link.to.startsWith("mailto:") || link.to.startsWith("http")) {
    return (
      <a
        href={link.to}
        className={className}
        target={link.to.startsWith("http") ? "_blank" : undefined}
        rel={link.to.startsWith("http") ? "noreferrer" : undefined}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.to} className={className}>
      {link.label}
    </Link>
  );
}

function SocialIcon({ id }: { id: (typeof FOOTER_SOCIAL)[number]["id"] }) {
  const common = "h-4 w-4";

  switch (id) {
    case "github":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.795-.735-.405-1.035-1.005-1.305-1.005-1.305-.81-.555.015-.555.015-.555.885.075 1.35.915 1.35.915.81 1.395 2.115.99 2.625.75.075-.585.315-.99.57-1.215-2.4-.27-4.92-1.2-4.92-5.355 0-1.185.405-2.145 1.08-2.895-.105-.27-.465-1.335.105-2.775 0 0 .885-.285 2.895 1.095.84-.24 1.725-.36 2.625-.36.9 0 1.785.12 2.625.36 2.01-1.395 2.895-1.095 2.895-1.095.57 1.44.21 2.505.105 2.775.675.75 1.08 1.71 1.08 2.895 0 4.17-2.535 5.085-4.935 5.355.39.33.735.96.735 1.935 0 1.395-.015 2.52-.015 2.865 0 .285.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
  }
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer pb-[calc(4rem+env(safe-area-inset-bottom,0px))] text-footer-muted md:pb-0 md:pl-30">
      <div className="page-content footer-content">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.5fr)] lg:gap-x-8 lg:gap-y-10">
          {/* Brand & contact */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <BrandIcon size={16} boxClassName="h-9 w-9 rounded-lg" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-white">
                  Kien&apos;s Space
                </p>
                <p className="mt-0.5 text-xs leading-snug text-footer-muted">
                  {FOOTER_TAGLINE}
                </p>
              </div>
            </div>

            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-footer-subtle">Email: </span>
                <a
                  href={`mailto:${FOOTER_CONTACT.email}`}
                  className="transition-colors hover:text-white"
                >
                  {FOOTER_CONTACT.email}
                </a>
              </li>
              <li>
                <span className="text-footer-subtle">GitHub: </span>
                <a
                  href={FOOTER_CONTACT.github}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  @kien
                </a>
              </li>
              <li>
                <span className="text-footer-subtle">Địa chỉ: </span>
                {FOOTER_CONTACT.location}
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="rounded border border-footer-border bg-footer-badge px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-footer-muted">
                Open Source
              </span>
              <span className="rounded border border-emerald-800/50 bg-emerald-950/40 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                Đang phát triển
              </span>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Sứ mệnh — rộng gấp 1.5 lần các cột khác (grid 1.5fr) */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Sứ mệnh
            </h3>
            <p className="text-sm leading-relaxed">
              Nơi mình chia sẻ các dự án thực tế, công cụ hỗ trợ lập trình và
              kiến thức học được trong quá trình code — từ frontend, backend đến
              triển khai sản phẩm.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-footer-subtle">
              Portfolio cá nhân · Node.js · React · TypeScript
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar — border trùng độ cao với border-t terminal sidebar */}
      <div className="border-t border-footer-border">
        <div className="page-content footer-content footer-content--bar flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs sm:text-left">
            © 2024 – {year} Kien&apos;s Space. Nền tảng chia sẻ dự án &amp; kiến
            thức lập trình.
          </p>

          <div className="flex items-center gap-2">
            {FOOTER_SOCIAL.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded bg-footer-social text-white transition-opacity hover:opacity-80"
                style={{ color: social.color }}
              >
                <SocialIcon id={social.id} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
