import { HOME_STATS } from "../../data/homeContent";
import SectionHeader from "./SectionHeader";

function StatsSection() {
  return (
    <section aria-labelledby="stats-heading">
      <SectionHeader title="Về tôi" />
      <h2 id="stats-heading" className="sr-only">
        Về tôi
      </h2>

      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-4 sm:gap-6 sm:p-8">
        {HOME_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
