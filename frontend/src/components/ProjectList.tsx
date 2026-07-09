import { SAMPLE_PROJECTS } from "../data/projects";
import ProjectCard from "./ProjectCard";

type ProjectListProps = {
  onSelectProject: (id: string) => void;
};

const ProjectList = ({ onSelectProject }: ProjectListProps) => (
  <section>
    <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-500">
      Khám phá các dự án mã nguồn mở và đồ án thực tế — từ frontend, backend đến
      full-stack.
    </p>

    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {SAMPLE_PROJECTS.map((project) => (
        <li key={project.id}>
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
