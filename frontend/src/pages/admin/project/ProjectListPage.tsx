import { useNavigate } from "react-router-dom";
import ProjectListTable from "../../../components/admin/ProjectListTable";
import useProjects from "../../../hooks/useProjects";
import type { Project } from "../../../types/project";

export default function ProjectListPage() {

  const navigate = useNavigate();

  const {
    projects,
    loading,
    deleteProject,
  } = useProjects();

  // ==========================
  // Navigation
  // ==========================

  const handleAdd = () => {
    navigate("/admin/project/new");
  };

  const handleView = (project: Project) => {
    navigate(`/admin/project/${project.id}`);
  };

  const handleEdit = (project: Project) => {
    navigate(`/admin/project/edit/${project.id}`);
  };

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (project: Project) => {

    try {

      await deleteProject(project.id);

    } catch (error) {

      console.error(error);

      alert("Xóa Project thất bại.");

    }

  };

  return (

    <div className="space-y-6">

      <ProjectListTable
        projects={projects}
        isLoading={loading}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

    </div>

  );

}