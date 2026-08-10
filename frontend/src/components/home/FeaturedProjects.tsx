import { Code2, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";
import usePublicProjects from "../../hooks/usePublicProjects";
import type { Project } from "../../types/project";
import { InlineLoading } from "../LoadingKit";
import SectionHeader from "./SectionHeader";

const PLACEHOLDER_THUMB =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80";

function projectBadge(project: Project): { label: string; tone: "hot" | "new" } | null {
  if (project.viewCount >= 1000) {
    return { label: "hot", tone: "hot" };
  }

  if (project.finishedAt) {
    const finished = new Date(project.finishedAt);
    const monthsAgo =
      (Date.now() - finished.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsAgo <= 6) {
      return { label: "mới", tone: "new" };
    }
  }

  return null;
}

function badgeClass(tone: "hot" | "new") {
  return tone === "hot"
    ? "bg-rose-50 text-rose-600 ring-rose-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function techLine(project: Project) {
  return project.desc ?? project.sumary ?? "Full-stack project";
}

function ratingFromViews(viewCount: number) {
  return Math.min(5, 4.5 + (viewCount % 50) / 100).toFixed(1);
}

function FeaturedProjectCard({ project }: { project: Project }) {
  const badge = projectBadge(project);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-brand-border hover:shadow-md">
      <Link to={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-hover">
          <img
            src={project.thumbnail ?? PLACEHOLDER_THUMB}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {badge ? (
            <span
              className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${badgeClass(badge.tone)}`}
            >
              {badge.label}
            </span>
          ) : null}
        </div>

        <div className="p-4 pb-0">
          <h3 className="line-clamp-2 text-base font-bold text-ink group-hover:text-brand">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{techLine(project)}</p>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border p-4 pt-3">
          <div className="flex items-center gap-3 text-sm font-medium">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-brand hover:text-brand-hover"
              >
                Demo
                <ExternalLink size={14} aria-hidden />
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-muted hover:text-ink"
              >
                Code
                <Code2 size={14} aria-hidden />
              </a>
            ) : null}
          </div>

          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden />
            {ratingFromViews(project.viewCount)}
          </span>
      </div>
    </article>
  );
}

function FeaturedProjects() {
  const { projects, loading, error } = usePublicProjects();

  const featured = projects
    .filter((p) => p.featured && p.isDisplay)
    .slice(0, 3);

  return (
    <section aria-labelledby="featured-heading">
      <SectionHeader title="Dự án nổi bật" viewAllHref="/projects" />
      <h2 id="featured-heading" className="sr-only">
        Dự án nổi bật
      </h2>

      {loading ? <InlineLoading message="Đang tải dự án…" /> : null}

      {!loading && error ? (
        <p className="rounded-2xl border border-border bg-surface px-4 py-6 text-sm text-muted">
          Không tải được dự án từ server.{" "}
          <Link to="/projects" className="font-semibold text-brand hover:underline">
            Xem trang dự án
          </Link>
        </p>
      ) : null}

      {!loading && !error && featured.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface px-4 py-6 text-sm text-muted">
          Chưa có dự án nổi bật.{" "}
          <Link to="/projects" className="font-semibold text-brand hover:underline">
            Khám phá tất cả dự án
          </Link>
        </p>
      ) : null}

      {!loading && !error && featured.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default FeaturedProjects;
