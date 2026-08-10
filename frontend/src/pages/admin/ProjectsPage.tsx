import { useNavigate } from "react-router-dom";
import ProjectListTable from "../../components/admin/ProjectListTable";
import useProjects from "../../hooks/useProjects";
import type { Project } from "../../types/project";
import { PageLoading } from "../../components/LoadingKit";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, error, fetchProjects, deleteProject } =
    useProjects();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Project</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tạo, sửa và quản lý dự án hiển thị trên trang public /projects
        </p>
      </div>

      {loading ? (
        <PageLoading
          variant="embedded"
          title="Đang tải dự án"
          message="Đang lấy danh sách project từ server…"
        />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
          <p className="font-medium text-red-800">{error}</p>
          <p className="mt-1 text-sm text-red-700">
            Thử đăng nhập lại hoặc kiểm tra backend đang chạy (port 8080).
          </p>
          <button
            type="button"
            onClick={() => fetchProjects()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <ProjectListTable
          projects={projects}
          isLoading={false}
          onAdd={() => navigate("/admin/projects/new")}
          onView={(p: Project) => window.open(`/projects/${p.slug}`, "_blank")}
          onEdit={(p: Project) => navigate(`/admin/projects/edit/${p.id}`)}
          onDelete={async (p) => {
            await deleteProject(p.id);
          }}
        />
      )}
    </div>
  );
}
