import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import ProjectDetailView from "../components/projects/ProjectDetailView";
import { InlineLoading } from "../components/LoadingKit";
import useProjectBySlug from "../hooks/useProjectBySlug";
import usePublicProjects from "../hooks/usePublicProjects";
import usePageSeo from "../hooks/usePageSeo";
import { projectsToCatalog } from "../utils/projectCatalog";

function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading, error } = useProjectBySlug(slug);
  const { projects } = usePublicProjects();
  const catalog = useMemo(() => projectsToCatalog(projects), [projects]);

  const seoVars = useMemo(
    () =>
      project
        ? {
            projectTitle: project.title,
            projectSummary: project.description || project.title,
            projectDescription: project.longDescription || project.description || "",
            ogImage: project.thumbnail || "",
          }
        : {},
    [project],
  );

  const seoBreadcrumbs = useMemo(
    () =>
      project
        ? [
            { name: "Dự án", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ]
        : [],
    [project],
  );

  usePageSeo(seoVars, seoBreadcrumbs);

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
