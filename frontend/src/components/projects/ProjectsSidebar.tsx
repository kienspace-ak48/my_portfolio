import { Tag } from "lucide-react";
import type { CatalogProject } from "../../types/catalogProject";
import { STATUS_LABEL, getAllTags } from "../../utils/projectCatalog";

type ProjectsSidebarProps = {
  catalog: CatalogProject[];
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
};

function ProjectsSidebar({
  catalog,
  activeTag,
  onTagSelect,
}: ProjectsSidebarProps) {
  const tags = getAllTags(catalog).slice(0, 12);
  const statusCounts = catalog.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <aside className="space-y-5 lg:sticky lg:top-36 lg:self-start">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-sm font-bold text-ink">Theo trạng thái</h3>
        <ul className="mt-3 space-y-2">
          {(["completed", "in-progress", "archived"] as const).map((s) => (
            <li
              key={s}
              className="flex justify-between text-sm text-body"
            >
              <span>{STATUS_LABEL[s]}</span>
              <span className="font-mono-ui text-xs text-subtle">
                {statusCounts[s] ?? 0}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
          <Tag size={15} aria-hidden />
          Công nghệ
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagSelect(activeTag === tag ? null : tag)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                activeTag === tag
                  ? "bg-brand text-white"
                  : "bg-app text-muted hover:bg-hover hover:text-ink"
              }`}
            >
              {tag}
              <span className="ml-1 opacity-60">({count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border-strong bg-app/40 p-5">
        <p className="text-sm font-medium text-ink">Đọc case study</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          Chọn một dự án để xem mô tả chi tiết, tech stack và link demo/source.
        </p>
      </div>
    </aside>
  );
}

export default ProjectsSidebar;
