import { Grid3x3, List, Search, SlidersHorizontal, X } from "lucide-react";
import type { ProjectSort, ProjectStatusFilter, ProjectViewMode } from "../../types/catalogProject";
import { STATUS_LABEL } from "../../utils/projectCatalog";

type ProjectsToolbarProps = {
  query: string;
  onQueryChange: (v: string) => void;
  status: ProjectStatusFilter;
  onStatusChange: (v: ProjectStatusFilter) => void;
  sort: ProjectSort;
  onSortChange: (v: ProjectSort) => void;
  viewMode: ProjectViewMode;
  onViewModeChange: (v: ProjectViewMode) => void;
  resultCount: number;
  activeTag: string | null;
  onClearTag: () => void;
};

const STATUS_FILTERS: { value: ProjectStatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "featured", label: "Nổi bật" },
  { value: "completed", label: STATUS_LABEL.completed },
  { value: "in-progress", label: STATUS_LABEL["in-progress"] },
];

function ProjectsToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
  activeTag,
  onClearTag,
}: ProjectsToolbarProps) {
  const hasFilters = Boolean(query || status !== "all" || activeTag);

  return (
    <div className="sticky top-16 z-20 space-y-4 rounded-2xl border border-border bg-surface/95 p-4 shadow-sm backdrop-blur-md sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Tìm theo tên, mô tả, công nghệ..."
            className="w-full rounded-xl border border-border bg-app py-2.5 pr-4 pl-10 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={16} className="text-subtle" aria-hidden />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ProjectSort)}
            className="rounded-xl border border-border bg-app px-3 py-2.5 text-sm outline-none focus:border-brand"
            aria-label="Sắp xếp dự án"
          >
            <option value="featured">Ưu tiên nổi bật</option>
            <option value="newest">Mới nhất</option>
            <option value="name">Tên A–Z</option>
          </select>

          <div className="flex rounded-xl border border-border bg-app p-1">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`rounded-lg p-2 transition ${
                viewMode === "grid"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-label="Dạng lưới"
            >
              <Grid3x3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`rounded-lg p-2 transition ${
                viewMode === "list"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-label="Dạng danh sách"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onStatusChange(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              status === f.value
                ? "bg-ink text-white"
                : "bg-app text-muted hover:bg-hover hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}

        {activeTag ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
            #{activeTag}
            <button type="button" onClick={onClearTag} aria-label="Bỏ tag">
              <X size={14} />
            </button>
          </span>
        ) : null}

        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              onStatusChange("all");
              onClearTag();
            }}
            className="ml-auto text-xs font-medium text-brand hover:text-brand-hover"
          >
            Xóa bộ lọc
          </button>
        ) : null}
      </div>

      <p className="text-xs text-subtle">{resultCount} dự án phù hợp</p>
    </div>
  );
}

export default ProjectsToolbar;
