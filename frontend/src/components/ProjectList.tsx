import { SAMPLE_PROJECTS } from "../data/projects";
import ProjectCard from "./ProjectCard";

type ProjectListProps = {
  onSelectProject: (id: string) => void;
};

const ProjectList = ({ onSelectProject }: ProjectListProps) => (
  <section>
    <p className="mb-5 max-w-3xl text-sm leading-relaxed text-slate-500">
      Khám phá các dự án mã nguồn mở và đồ án thực tế — từ frontend, backend đến
      full-stack.
    </p>

    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {SAMPLE_PROJECTS.map((project) => (
        <li key={project.id} className="h-full">
          <ProjectCard
            project={project}
            onClick={() => onSelectProject(project.id)}
          />
        </li>
      ))}
    </ul>
  </section>
);

export default ProjectList;
