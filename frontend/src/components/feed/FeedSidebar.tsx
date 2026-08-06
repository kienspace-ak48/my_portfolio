import type { FeedPromo } from "../../types/newsFeed";

type FeedSidebarProps = {
  promos: FeedPromo[];
};

function FeedSidebar({ promos }: FeedSidebarProps) {
  return (
    <div className="space-y-4">
      {promos.map((promo) => (
        <a
          key={promo.id}
          href={promo.href}
          className="block overflow-hidden rounded-xl bg-white transition hover:opacity-95"
        >
          <img
            src={promo.imageUrl}
            alt={promo.alt ?? "Quảng cáo"}
            className="h-auto w-full object-cover"
          />
        </a>
      ))}
    </div>
  );
}

export default FeedSidebar;
