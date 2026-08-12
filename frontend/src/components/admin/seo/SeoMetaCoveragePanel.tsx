type Props = {
  siteUrl?: string;
};

const META_TAGS = [
  "title / og:title",
  "description / og:description",
  "meta keywords",
  "robots",
  "canonical",
  "og:image",
  "theme-color",
  "twitter:card + site",
  "og:locale",
  "JSON-LD",
];

export default function SeoMetaCoveragePanel({ siteUrl }: Props) {
  const crawlUrl = siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const toolHref = `/tools/meta-tag?url=${encodeURIComponent(crawlUrl)}`;

  return (
    <div className="rounded-xl border border-border bg-app/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">Meta đang được sinh</p>
        <a
          href={toolHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-brand-border bg-brand-soft px-2.5 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
        >
          Meta Tag Tool ↗
        </a>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {META_TAGS.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] text-ink"
          >
            <span className="text-emerald-600" aria-hidden>
              ✓
            </span>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
