import { useCallback, useEffect, useState } from "react";
import { BASE_API } from "../api/fetchApi";
import type { Project, ProjectQuery } from "../types/project";

function usePublicProjects(params?: ProjectQuery) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const queryKey = JSON.stringify(params ?? {});

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL(`${BASE_API}/projects`);
      if (params?.q) url.searchParams.set("q", params.q);
      if (params?.status) url.searchParams.set("status", params.status);
      if (params?.tag) url.searchParams.set("tag", params.tag);
      if (params?.featured) url.searchParams.set("featured", params.featured);
      if (params?.sort) url.searchParams.set("sort", params.sort);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setProjects(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

export default usePublicProjects;
