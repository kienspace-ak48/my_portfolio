import {
  ArrowLeft,
  Calendar,
  CircleDot,
  Code2,
  ExternalLink,
} from "lucide-react";
import type { Project } from "../data/projects";

type ProjectDetailProps = {
  project: Project;
  onBack: () => void;
};

const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "Hoàn thành",
  "in-progress": "Đang phát triển",
  archived: "Lưu trữ",
};

const STATUS_COLOR: Record<Project["status"], string> = {
  completed: "bg-emerald-50 text-emerald-700",
  "in-progress": "bg-amber-50 text-amber-700",
  archived: "bg-slate-100 text-slate-600",
};

const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => (
  <article className="space-y-6">
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <ArrowLeft size={16} />
      Quay lại danh sách
    </button>

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[21/9] overflow-hidden bg-slate-100">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 shadow-sm backdrop-blur-sm">
          {project.badge}
        </span>
      </div>

      <div className="space-y-6 p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {project.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
              >
                <ExternalLink size={15} />
                Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Code2 size={15} />
                Source
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${STATUS_COLOR[project.status]}`}
          >
            <CircleDot size={14} />
            {STATUS_LABEL[project.status]}
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Calendar size={14} />
            {project.year}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono-ui rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="font-display mb-3 text-lg font-bold text-slate-900">
            Giới thiệu
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {project.longDescription}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="font-display mb-3 text-lg font-bold text-slate-900">
            Tính năng nổi bật
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </article>
);

export default ProjectDetail;
