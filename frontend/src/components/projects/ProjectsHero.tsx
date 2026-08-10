import { FolderKanban, Sparkles, Tag } from "lucide-react";

type ProjectsHeroProps = {
  total: number;
  featuredCount: number;
  tagCount: number;
};

function ProjectsHero({ total, featuredCount, tagCount }: ProjectsHeroProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-border bg-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-soft)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-subtle">
          Project catalog
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Thư viện dự án
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Tra cứu, lọc và đọc chi tiết các dự án full-stack — demo, source code
          và mô tả kỹ thuật. Chọn dự án để xem case study ngắn.
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-lg">
          <div className="rounded-xl bg-app px-3 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-subtle">
              <FolderKanban size={13} aria-hidden />
              Tổng
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {total}
            </dd>
          </div>
          <div className="rounded-xl bg-app px-3 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-subtle">
              <Sparkles size={13} aria-hidden />
              Nổi bật
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {featuredCount}
            </dd>
          </div>
          <div className="rounded-xl bg-app px-3 py-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-subtle">
              <Tag size={13} aria-hidden />
              Tags
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {tagCount}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}

export default ProjectsHero;
