import { useEffect, useState } from "react";
import type { Project } from "../types/project";
import { apiToCatalog } from "../utils/projectCatalog";
import type { CatalogProject } from "../types/catalogProject";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

function useProjectBySlug(slug: string | undefined) {
  const [project, setProject] = useState<CatalogProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/projects/slug/${encodeURIComponent(slug!)}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        const data = json.data as Project;
        if (!cancelled) {
          setProject(data ? apiToCatalog(data) : null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setProject(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { project, loading, error };
}

export default useProjectBySlug;
