import { useState } from "react";
import { getProjectById } from "../data/projects";
import ProjectList from "../components/ProjectList";
import ProjectDetail from "../components/ProjectDetail";

function Projects() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const selectedProject = selectedProjectId
    ? getProjectById(selectedProjectId)
    : undefined;

  return (
    <div className="w-full">
      <h1 className="font-display mb-4 text-2xl font-extrabold text-slate-900 sm:mb-5 sm:text-3xl">
        {selectedProject ? selectedProject.title : "Dự án nổi bật"}
      </h1>

      {selectedProject ? (
        <ProjectDetail
          project={selectedProject}
          onBack={() => setSelectedProjectId(null)}
        />
      ) : (
        <ProjectList onSelectProject={setSelectedProjectId} />
      )}
    </div>
  );
}

export default Projects;
