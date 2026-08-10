import { Link2 } from "lucide-react";
import { useState } from "react";

type BlogShareBarProps = {
  title: string;
  slug: string;
};

function BlogShareBar({ title, slug }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `/blog/${slug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-app/60 px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-subtle">
        Chia sẻ
      </span>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-ink ring-1 ring-border transition hover:bg-hover"
      >
        <Link2 size={14} aria-hidden />
        {copied ? "Đã copy!" : "Copy link"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-muted ring-1 ring-border transition hover:text-ink"
      >
        𝕏
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg bg-surface px-3 py-1.5 text-sm font-medium text-muted ring-1 ring-border transition hover:text-ink"
      >
        Facebook
      </a>
    </div>
  );
}

export default BlogShareBar;
