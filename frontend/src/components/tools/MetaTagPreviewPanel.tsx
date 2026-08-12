import { useMemo, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Code2, Copy, Eye } from "lucide-react";
import {
  inspectMetaTags,
  inspectorSummary,
  resolveMetaValues,
  type MetaTagForm,
} from "../../utils/metaTagGenerator";
import { copyText } from "../../utils/copyText";

export type PreviewPlatform =
  | "google"
  | "facebook"
  | "x"
  | "linkedin"
  | "zalo"
  | "code";

const SOCIAL_PLATFORMS: { id: PreviewPlatform; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "zalo", label: "Zalo" },
];

/* ── Icons ── */
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.063 2.063 0 01-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ZaloIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#0068FF" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Arial,sans-serif">Z</text>
    </svg>
  );
}

function PreviewPlatformIcon({ id, active }: { id: PreviewPlatform; active: boolean }) {
  const cls = active ? "opacity-100" : "opacity-40 grayscale-[0.15]";
  switch (id) {
    case "google": return <span className={cls}><GoogleIcon /></span>;
    case "facebook": return <span className={cls}><FacebookIcon /></span>;
    case "x": return <span className={`${cls} text-ink`}><XIcon /></span>;
    case "linkedin": return <span className={cls}><LinkedinIcon /></span>;
    case "zalo": return <span className={cls}><ZaloIcon /></span>;
    case "code": return <Code2 size={18} className={active ? "text-brand" : "text-muted"} aria-hidden />;
  }
}

function PreviewFrame({
  label,
  spec,
  bg = "bg-[#f0f2f5]",
  children,
}: {
  label: string;
  spec: string;
  bg?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-ink">{label}</p>
        <p className="font-mono-ui text-[10px] text-subtle">{spec}</p>
      </div>
      <div className={`rounded-xl p-4 ${bg}`}>
        <div className="mx-auto w-full">{children}</div>
      </div>
    </div>
  );
}

function OgImage({
  src,
  aspectClass,
  fallback,
}: {
  src: string;
  aspectClass: string;
  fallback: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-[#e4e6eb] ${aspectClass}`}>
      {src ? (
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
      ) : (
        <div className="flex h-full min-h-[120px] items-center justify-center px-4 text-center text-xs text-subtle">{fallback}</div>
      )}
    </div>
  );
}

function hostnameFrom(url: string, siteName: string) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : siteName || "website.com";
  } catch {
    return siteName || "website.com";
  }
}

/* ── Platform previews (approximate real render sizes) ── */

function GooglePreview({ title, url, description }: { title: string; url: string; description: string }) {
  const displayUrl = (() => {
    try {
      const p = new URL(url || "https://example.com");
      const path = p.pathname === "/" ? "" : p.pathname;
      return `${p.hostname.replace(/^www\./, "")}${path}`;
    } catch {
      return "example.com › trang";
    }
  })();

  return (
    <PreviewFrame label="Google Search" spec="~600px · snippet desktop" bg="bg-white">
      <div className="max-w-[600px] px-1 py-1">
        <p className="truncate text-[14px] leading-5 text-[#202124]">{displayUrl}</p>
        <p className="mt-0.5 line-clamp-1 text-[20px] leading-[26px] text-[#1a0dab]">{title || "Tiêu đề trang"}</p>
        <p className="mt-1 line-clamp-2 text-[14px] leading-[22px] text-[#4d5156]">{description || "Mô tả meta hiển thị trên kết quả tìm kiếm."}</p>
      </div>
    </PreviewFrame>
  );
}

function FacebookPreview({ title, description, image, url, siteName }: { title: string; description: string; image: string; url: string; siteName: string }) {
  const host = hostnameFrom(url, siteName).toUpperCase();
  return (
    <PreviewFrame label="Facebook / Messenger" spec="500px · ảnh 1200×630 (1.91:1)">
      <div className="max-w-[500px] overflow-hidden rounded-md border border-[#dddfe2] bg-white shadow-sm">
        <OgImage src={image} aspectClass="aspect-[1.91/1]" fallback="Khuyến nghị 1200 × 630 px" />
        <div className="border-t border-[#dddfe2] bg-[#f2f3f5] px-3 py-2.5">
          <p className="text-[12px] leading-4 tracking-wide text-[#606770]">{host}</p>
          <p className="mt-1 line-clamp-2 text-[16px] font-semibold leading-5 text-[#1d2129]">{title || "Tiêu đề link preview"}</p>
          {description ? <p className="mt-0.5 line-clamp-1 text-[14px] leading-5 text-[#606770]">{description}</p> : null}
        </div>
      </div>
    </PreviewFrame>
  );
}

function XPreview({ title, description, image, url }: { title: string; description: string; image: string; url: string }) {
  const host = hostnameFrom(url, "");
  return (
    <PreviewFrame label="X (Twitter)" spec="506px · summary_large_image 2:1">
      <div className="max-w-[506px] overflow-hidden rounded-2xl border border-[#cfd9de] bg-white">
        <OgImage src={image} aspectClass="aspect-[2/1]" fallback="Khuyến nghị 1200 × 600 px (2:1)" />
        <div className="px-3 py-2.5">
          <p className="truncate text-[13px] leading-4 text-[#536471]">{host}</p>
          <p className="mt-0.5 line-clamp-2 text-[15px] leading-5 text-[#0f1419]">{title || "Tiêu đề card"}</p>
          {description ? <p className="mt-0.5 line-clamp-2 text-[13px] leading-4 text-[#536471]">{description}</p> : null}
        </div>
      </div>
    </PreviewFrame>
  );
}

function LinkedinPreview({ title, image, url, siteName }: { title: string; image: string; url: string; siteName: string }) {
  const host = hostnameFrom(url, siteName);
  return (
    <PreviewFrame label="LinkedIn" spec="552px · ảnh 1200×627 (1.91:1)" bg="bg-[#f3f2ef]">
      <div className="max-w-[552px] overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
        <OgImage src={image} aspectClass="aspect-[1.91/1]" fallback="Khuyến nghị 1200 × 627 px" />
        <div className="px-3 py-2.5">
          <p className="line-clamp-2 text-[14px] font-semibold leading-5 text-[#000000de]">{title || "Tiêu đề bài viết"}</p>
          <p className="mt-1 truncate text-[12px] leading-4 text-[#00000099]">{host}</p>
        </div>
      </div>
    </PreviewFrame>
  );
}

function ZaloPreview({ title, description, image, url, siteName }: { title: string; description: string; image: string; url: string; siteName: string }) {
  const host = hostnameFrom(url, siteName);
  return (
    <PreviewFrame label="Zalo" spec="~320px · preview mobile chat" bg="bg-[#e5efff]">
      <div className="max-w-[320px] overflow-hidden rounded-xl border border-[#d0deef] bg-white shadow-md">
        <OgImage src={image} aspectClass="aspect-[1.91/1]" fallback="Ảnh OG 1200×630" />
        <div className="px-2.5 py-2">
          <p className="line-clamp-2 text-[14px] font-semibold leading-[18px] text-[#001a33]">{title || "Tiêu đề link"}</p>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-[#5f6b7a]">{description || host}</p>
        </div>
      </div>
    </PreviewFrame>
  );
}

function MetaTagInspector({ checks }: { checks: ReturnType<typeof inspectMetaTags> }) {
  const summary = inspectorSummary(checks);
  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-ink">Meta-tag inspector</h3>
        <div className="flex gap-2 text-xs font-medium">
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700">✕ {summary.error}</span>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">! {summary.warn}</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">✓ {summary.ok}</span>
        </div>
      </div>
      <ul className="mt-3 max-h-56 space-y-2 overflow-auto">
        {checks.map((check) => (
          <li key={check.id} className="flex gap-3 rounded-xl border border-border bg-app px-3 py-2.5">
            {check.status === "ok" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden />
            ) : (
              <AlertCircle size={16} className={`mt-0.5 shrink-0 ${check.status === "error" ? "text-rose-500" : "text-amber-500"}`} aria-hidden />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{check.label}</p>
              <p className="font-mono-ui text-[11px] text-subtle">{check.tag}</p>
              <p className="mt-0.5 text-xs text-muted">{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type MetaTagPreviewPanelProps = {
  form: MetaTagForm;
  html?: string;
  showCode?: boolean;
  showInspector?: boolean;
  compact?: boolean;
};

function MetaTagPreviewPanel({
  form,
  html = "",
  showCode = true,
  showInspector = true,
  compact = false,
}: MetaTagPreviewPanelProps) {
  const [platform, setPlatform] = useState<PreviewPlatform>("google");
  const [copied, setCopied] = useState(false);
  const resolved = useMemo(() => resolveMetaValues(form), [form]);
  const checks = useMemo(() => inspectMetaTags(form), [form]);
  const platforms = showCode ? [...SOCIAL_PLATFORMS, { id: "code" as const, label: "Code" }] : SOCIAL_PLATFORMS;

  async function handleCopy() {
    if (!html) return;
    const ok = await copyText(html);
    if (ok) { setCopied(true); window.setTimeout(() => setCopied(false), 1500); }
  }

  function renderBody() {
    if (platform === "code") {
      return (
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">HTML meta tags — dán vào &lt;head&gt;</p>
            <button type="button" onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted hover:text-brand">
              <Copy size={14} aria-hidden /> Sao chép
            </button>
          </div>
          {copied ? <p className="mt-2 text-sm text-emerald-600">Đã sao chép!</p> : null}
          <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-[#0f172a] p-4 text-xs leading-relaxed text-emerald-100"><code>{html || "<!-- ... -->"}</code></pre>
        </div>
      );
    }
    if (platform === "google") {
      return <GooglePreview title={resolved.title} url={form.canonical || resolved.ogUrl} description={resolved.description} />;
    }
    if (platform === "x") {
      return <XPreview title={resolved.twitterTitle} description={resolved.twitterDescription} image={resolved.twitterImage} url={resolved.ogUrl} />;
    }
    if (platform === "linkedin") {
      return <LinkedinPreview title={resolved.ogTitle} image={resolved.ogImage} url={resolved.ogUrl} siteName={form.ogSiteName} />;
    }
    if (platform === "zalo") {
      return <ZaloPreview title={resolved.ogTitle} description={resolved.ogDescription} image={resolved.ogImage} url={resolved.ogUrl} siteName={form.ogSiteName} />;
    }
    return <FacebookPreview title={resolved.ogTitle} description={resolved.ogDescription} image={resolved.ogImage} url={resolved.ogUrl} siteName={form.ogSiteName} />;
  }

  return (
    <div className={compact ? "" : "rounded-2xl border border-border bg-surface p-5"}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink"><Eye size={16} aria-hidden /> Xem trực quan khi share</h3>
        <div className="flex items-center gap-1">
          {platforms.map(({ id, label }) => (
            <button key={id} type="button" title={label} onClick={() => setPlatform(id)} className={`rounded-lg p-2 transition ${platform === id ? "bg-brand-soft ring-1 ring-brand-border" : "hover:bg-hover"}`}>
              <PreviewPlatformIcon id={id} active={platform === id} />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">{renderBody()}</div>
      {showInspector && platform !== "code" ? <MetaTagInspector checks={checks} /> : null}
    </div>
  );
}

export default MetaTagPreviewPanel;
