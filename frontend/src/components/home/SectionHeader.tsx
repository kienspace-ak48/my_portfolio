import { Link } from "react-router-dom";

type SectionHeaderProps = {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = "Xem tất cả",
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      {viewAllHref ? (
        <Link
          to={viewAllHref}
          className="shrink-0 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
        >
          {viewAllLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default SectionHeader;
