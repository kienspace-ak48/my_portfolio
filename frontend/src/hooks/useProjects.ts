import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/fetchApi";
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
      const json = await apiFetch<Project[]>("/projects/admin", undefined, {
        auth: true,
      });
      setProjects(Array.isArray(json.data) ? json.data : []);
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
