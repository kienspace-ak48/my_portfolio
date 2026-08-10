import { Clock, Search, SlidersHorizontal, X } from "lucide-react";
import type { BlogCategory } from "../../types/blog";
import { BLOG_CATEGORY_LABELS } from "../../types/blog";

type BlogToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  category: string | null;
  onCategoryChange: (value: string | null) => void;
  sort: "newest" | "popular";
  onSortChange: (value: "newest" | "popular") => void;
  resultCount: number;
};

const CATEGORIES: (BlogCategory | "all")[] = [
  "all",
  "backend",
  "frontend",
  "devops",
  "tutorial",
  "career",
];

function BlogToolbar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  resultCount,
}: BlogToolbarProps) {
  const hasFilters = Boolean(query || category);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Tìm bài viết, tag..."
            className="w-full rounded-xl border border-border bg-app py-2.5 pr-4 pl-10 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="shrink-0 text-subtle" aria-hidden />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as "newest" | "popular")}
            className="rounded-xl border border-border bg-app px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
            aria-label="Sắp xếp bài viết"
          >
            <option value="newest">Mới nhất</option>
            <option value="popular">Đọc lâu (gợi ý)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const active =
            cat === "all" ? category === null : category === cat;
          const label =
            cat === "all" ? "Tất cả" : BLOG_CATEGORY_LABELS[cat];

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat === "all" ? null : cat)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-ink text-white"
                  : "bg-app text-muted hover:bg-hover hover:text-ink"
              }`}
            >
              {label}
            </button>
          );
        })}

        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              onCategoryChange(null);
            }}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-hover"
          >
            <X size={14} aria-hidden />
            Xóa lọc
          </button>
        ) : null}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-subtle">
        <Clock size={13} aria-hidden />
        {resultCount} bài viết
      </p>
    </div>
  );
}

export default BlogToolbar;
