import type { MockProject } from "../data/projects";

type ProjectCardProps = {
  project: MockProject;
  onClick: () => void;
};

const ProjectCard = ({ project, onClick }: ProjectCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
  >
    <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-slate-100">
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute left-3 top-3 inline-flex rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-orange-700 shadow-sm backdrop-blur-sm">
        {project.badge}
      </span>
    </div>

    <div className="flex flex-1 flex-col gap-2 p-4">
      <h3 className="font-display line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-slate-900 group-hover:text-orange-700">
        {project.title}
      </h3>

      <p className="line-clamp-3 min-h-[4.125rem] text-sm leading-relaxed text-slate-500">
        {project.description}
      </p>
    </div>
  </button>
);

export default ProjectCard;
