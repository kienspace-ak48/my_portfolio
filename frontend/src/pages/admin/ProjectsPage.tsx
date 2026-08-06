import { useNavigate } from "react-router-dom";
import ProjectListTable from "../../components/admin/ProjectListTable";
import useProjects from "../../hooks/useProjects";
import type { Project } from "../../types/project";
import { PageLoading } from "../../components/LoadingKit";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, deleteProject } = useProjects();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Project</h1>
        <p className="mt-1 text-sm text-slate-500">
          Khớp model Prisma: slug, title, sumary, desc, thumbnail, featured…
        </p>
      </div>

      {loading ? (
        <PageLoading
          variant="embedded"
          title="Đang tải dự án"
          message="Đang lấy danh sách project từ server…"
        />
      ) : (
        <ProjectListTable
          projects={projects}
          isLoading={false}
          onAdd={() => navigate("/admin/projects/new")}
          onView={(p: Project) => window.open(p.demoUrl ?? "#", "_blank")}
          onEdit={(p: Project) => navigate(`/admin/projects/edit/${p.id}`)}
          onDelete={async (p) => {
            await deleteProject(p.id);
          }}
        />
      )}
    </div>
  );
}
