import { useCallback, useEffect, useState } from "react";
import * as projectApi from "../api/project.api";
import type { Project } from "../types/project";

function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectApi.getAdminProjects();
      const data = res.data?.data;
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không tải được danh sách dự án";
      setError(message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeProject = useCallback(
    async (id: number) => {
      await projectApi.deleteProject(id);
      await fetchProjects();
    },
    [fetchProjects],
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    deleteProject: removeProject,
  };
}

export default useProjects;
