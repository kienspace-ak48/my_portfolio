import { Link } from "react-router-dom";
import { DISCOVERY_CATEGORIES } from "../../data/homeContent";
import SectionHeader from "./SectionHeader";

function DiscoveryCategories() {
  return (
    <section aria-labelledby="discovery-heading">
      <SectionHeader title="Danh mục khám phá" viewAllHref="/projects" />
      <h2 id="discovery-heading" className="sr-only">
        Danh mục khám phá
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {DISCOVERY_CATEGORIES.map(({ id, label, icon: Icon, href }) => (
          <Link
            key={id}
            to={href}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-5 transition-all hover:border-brand-border hover:bg-brand-soft hover:shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-white">
              <Icon size={24} strokeWidth={1.75} aria-hidden />
            </span>
            <span className="text-center text-sm font-semibold text-ink">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default DiscoveryCategories;
