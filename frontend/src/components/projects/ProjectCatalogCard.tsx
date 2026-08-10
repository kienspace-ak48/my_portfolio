import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { CatalogProject } from "../../types/catalogProject";
import { STATUS_LABEL } from "../../utils/projectCatalog";

const STATUS_STYLE: Record<CatalogProject["status"], string> = {
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "in-progress": "bg-amber-50 text-amber-700 ring-amber-200",
  archived: "bg-hover text-muted ring-border",
};

type ProjectCatalogCardProps = {
  project: CatalogProject;
  variant?: "grid" | "list";
};

function ProjectCatalogCard({
  project,
  variant = "grid",
}: ProjectCatalogCardProps) {
  if (variant === "list") {
    return (
      <Link
        to={`/projects/${project.slug}`}
        className="group flex gap-4 rounded-2xl border border-border bg-surface p-3 transition hover:border-brand-border hover:shadow-sm sm:gap-5 sm:p-4"
      >
        <img
          src={project.thumbnail}
          alt=""
          className="h-28 w-36 shrink-0 rounded-xl object-cover sm:h-32 sm:w-44"
          loading="lazy"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">
              {project.badge}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${STATUS_STYLE[project.status]}`}
            >
              {STATUS_LABEL[project.status]}
            </span>
            {project.featured ? (
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                Featured
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 line-clamp-2 text-lg font-bold text-ink group-hover:text-brand">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {project.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-app px-2 py-0.5 text-[11px] text-muted"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto text-xs text-subtle">{project.year}</span>
          </div>
        </div>
        <ArrowUpRight
          size={18}
          className="mt-2 shrink-0 text-subtle transition group-hover:text-brand"
          aria-hidden
        />
      </Link>
    );
  }

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-brand-border hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-hover">
        <img
          src={project.thumbnail}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-surface/95 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand shadow-sm backdrop-blur-sm">
            {project.badge}
          </span>
          {project.featured ? (
            <span className="rounded-lg bg-brand px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              ★ Featured
            </span>
          ) : null}
        </div>
        <div className="absolute right-3 bottom-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
          {project.demoUrl ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-surface/95 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur-sm">
              <ExternalLink size={12} aria-hidden />
              Demo
            </span>
          ) : null}
          {project.repoUrl ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-surface/95 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur-sm">
              <Code2 size={12} aria-hidden />
              Code
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 flex-1 text-base font-bold leading-snug text-ink group-hover:text-brand sm:text-lg">
            {project.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${STATUS_STYLE[project.status]}`}
          >
            {STATUS_LABEL[project.status]}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-app px-2 py-0.5 text-[11px] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto font-mono-ui text-xs text-subtle">
            {project.year}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCatalogCard;
