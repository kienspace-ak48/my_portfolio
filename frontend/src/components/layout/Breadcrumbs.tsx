import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition hover:text-brand"
          >
            <Home size={14} aria-hidden />
            <span>Trang chủ</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-subtle" aria-hidden />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="rounded-md px-1 py-0.5 transition hover:text-brand"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-brand">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
