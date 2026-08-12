import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ToolMeta } from "../../types/tool";

type ToolCardProps = {
  tool: ToolMeta;
};

function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand-border hover:shadow-md sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Icon size={22} aria-hidden />
        </span>
        <ArrowUpRight
          size={18}
          className="shrink-0 text-subtle transition group-hover:text-brand"
          aria-hidden
        />
      </div>

      <h2 className="mt-4 text-lg font-bold text-ink group-hover:text-brand">
        {tool.title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {tool.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {tool.clientSide ? (
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200 ring-inset">
            Chạy trên trình duyệt
          </span>
        ) : (
          <span className="rounded-full bg-app px-2.5 py-0.5 text-[11px] font-semibold text-muted ring-1 ring-border ring-inset">
            Tra cứu online
          </span>
        )}
        <span className="rounded-full bg-app px-2.5 py-0.5 text-[11px] font-semibold text-muted ring-1 ring-border ring-inset">
          Miễn phí
        </span>
      </div>
    </Link>
  );
}

export default ToolCard;
