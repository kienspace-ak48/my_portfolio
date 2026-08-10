import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { InlineLoading } from "../components/LoadingKit";
import ProjectCatalogCard from "../components/projects/ProjectCatalogCard";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsSidebar from "../components/projects/ProjectsSidebar";
import ProjectsToolbar from "../components/projects/ProjectsToolbar";
import usePublicProjects from "../hooks/usePublicProjects";
import type {
  ProjectSort,
  ProjectStatusFilter,
  ProjectViewMode,
} from "../types/catalogProject";
import {
  filterCatalog,
  getAllTags,
  projectsToCatalog,
} from "../utils/projectCatalog";

function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatusFilter>("all");
  const [sort, setSort] = useState<ProjectSort>("featured");
  const [viewMode, setViewMode] = useState<ProjectViewMode>("grid");
  const [tag, setTag] = useState<string | null>(searchParams.get("tag"));

  useEffect(() => {
    setTag(searchParams.get("tag"));
  }, [searchParams]);

  function updateTag(next: string | null) {
    setTag(next);
    if (next) {
      setSearchParams({ tag: next });
    } else {
      setSearchParams({});
    }
  }

  const { projects, loading, error } = usePublicProjects();
  const catalog = useMemo(() => projectsToCatalog(projects), [projects]);

  const filtered = useMemo(
    () => filterCatalog(catalog, { query, status, tag, sort }),
    [catalog, query, status, tag, sort],
  );

  const featuredCount = catalog.filter((p) => p.featured).length;
  const tagCount = getAllTags(catalog).length;

  return (
    <div className="pb-8">
      <ProjectsHero
        total={catalog.length}
        featuredCount={featuredCount}
        tagCount={tagCount}
      />

      <div className="mt-8">
        <ProjectsToolbar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultCount={filtered.length}
          activeTag={tag}
          onClearTag={() => updateTag(null)}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_240px] xl:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          {loading && catalog.length === 0 ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-border bg-surface">
              <InlineLoading message="Đang tải dự án..." />
            </div>
          ) : error && catalog.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-8 text-center">
              <p className="font-medium text-amber-900">
                Không tải được dự án từ server.
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Kiểm tra backend đang chạy và thử tải lại trang.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-app/30 px-6 py-14 text-center">
              <p className="text-lg font-semibold text-ink">
                Không tìm thấy dự án phù hợp
              </p>
              <p className="mt-2 text-sm text-muted">
                Thử đổi từ khóa hoặc bỏ bớt bộ lọc.
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-2"
                  : "flex flex-col gap-3"
              }
            >
              {filtered.map((project) => (
                <ProjectCatalogCard
                  key={project.id}
                  project={project}
                  variant={viewMode}
                />
              ))}
            </div>
          )}
        </div>

        <ProjectsSidebar
          catalog={catalog}
          activeTag={tag}
          onTagSelect={updateTag}
        />
      </div>
    </div>
  );
}

export default Projects;
