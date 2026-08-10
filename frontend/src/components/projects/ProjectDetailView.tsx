import { ArrowLeft, Calendar, CheckCircle2, Code2, ExternalLink, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { CatalogProject } from "../../types/catalogProject";
import { STATUS_LABEL } from "../../utils/projectCatalog";
import ProjectShareBar from "./ProjectShareBar";
import ProjectCatalogCard from "./ProjectCatalogCard";

const STATUS_STYLE: Record<CatalogProject["status"], string> = {
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "in-progress": "bg-amber-50 text-amber-700 ring-amber-200",
  archived: "bg-hover text-muted ring-border",
};

type ProjectRelatedProps = {
  currentSlug: string;
  projects: CatalogProject[];
};

function ProjectRelated({ currentSlug, projects }: ProjectRelatedProps) {
  const related = projects
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-10">
      <h2 className="text-lg font-bold text-ink">Dự án liên quan</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          <ProjectCatalogCard key={p.id} project={p} variant="grid" />
        ))}
      </div>
    </section>
  );
}

type ProjectDetailViewProps = {
  project: CatalogProject;
  catalog: CatalogProject[];
};

function ProjectDetailView({ project, catalog }: ProjectDetailViewProps) {
  const isHtml = /<[^>]+>/.test(project.longDescription);

  return (
    <article className="pb-10">
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
      >
        <ArrowLeft size={16} aria-hidden />
        Quay lại thư viện dự án
      </Link>

      <header className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="relative aspect-[2/1] max-h-[420px] w-full sm:aspect-[21/9]">
          <img
            src={project.thumbnail}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                {project.badge}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset backdrop-blur-sm ${STATUS_STYLE[project.status]}`}
              >
                {STATUS_LABEL[project.status]}
              </span>
              {project.featured ? (
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand">
                  ★ Featured
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 max-w-4xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-6 py-4 text-sm text-muted sm:px-10">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={14} aria-hidden />
            {project.year}
          </span>
          {project.viewCount != null ? (
            <>
              <span className="text-subtle">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Eye size={14} aria-hidden />
                {project.viewCount.toLocaleString("vi-VN")} lượt xem
              </span>
            </>
          ) : null}
          <span className="text-subtle">·</span>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Link
                key={tag}
                to={`/projects?tag=${encodeURIComponent(tag)}`}
                className="rounded-md bg-app px-2 py-0.5 text-xs font-medium text-muted transition hover:text-brand"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            <ExternalLink size={16} aria-hidden />
            Xem demo
          </a>
        ) : null}
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-hover"
          >
            <Code2 size={16} aria-hidden />
            Source code
          </a>
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-ink">Tổng quan</h2>
            <p className="mt-3 text-base leading-relaxed text-body">
              {project.description}
            </p>
          </section>

          {project.longDescription ? (
            <section>
              <h2 className="text-lg font-bold text-ink">Chi tiết</h2>
              {isHtml ? (
                <div
                  className="prose-article mt-4"
                  dangerouslySetInnerHTML={{
                    __html: project.longDescription,
                  }}
                />
              ) : (
                <p className="mt-3 text-base leading-relaxed text-body">
                  {project.longDescription}
                </p>
              )}
            </section>
          ) : null}

          {project.features.length > 0 ? (
            <section>
              <h2 className="text-lg font-bold text-ink">Tính năng chính</h2>
              <ul className="mt-4 space-y-2">
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-body"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-brand"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <ProjectShareBar title={project.title} slug={project.slug} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-ink">Tech stack</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/projects?tag=${encodeURIComponent(tag)}`}
                  className="rounded-lg bg-app px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-hover hover:text-brand"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-border-strong bg-app/40 p-5">
            <p className="text-sm font-medium text-ink">Tra cứu thêm</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Dùng bộ lọc tag và trạng thái trên trang danh sách để tìm dự án
              tương tự.
            </p>
            <Link
              to="/projects"
              className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-hover"
            >
              Mở thư viện dự án →
            </Link>
          </div>
        </aside>
      </div>

      <ProjectRelated currentSlug={project.slug} projects={catalog} />
    </article>
  );
}

export default ProjectDetailView;
