import { Navigate, useParams } from "react-router-dom";
import ProjectDetailView from "../components/projects/ProjectDetailView";
import { InlineLoading } from "../components/LoadingKit";
import useProjectBySlug from "../hooks/useProjectBySlug";
import usePublicProjects from "../hooks/usePublicProjects";
import { projectsToCatalog } from "../utils/projectCatalog";
import { useMemo } from "react";

function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading, error } = useProjectBySlug(slug);
  const { projects } = usePublicProjects();
  const catalog = useMemo(() => projectsToCatalog(projects), [projects]);

  if (loading && !project) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <InlineLoading message="Đang tải dự án..." />
      </div>
    );
  }

  if (!project || error) {
    return <Navigate to="/projects" replace />;
  }

  return <ProjectDetailView project={project} catalog={catalog} />;
}

export default ProjectDetailPage;
