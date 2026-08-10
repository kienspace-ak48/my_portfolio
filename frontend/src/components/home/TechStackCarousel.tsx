import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { TECH_STACK } from "../../data/homeContent";
import SectionHeader from "./SectionHeader";

function TechStackCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = direction === "left" ? -240 : 240;
    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="tech-heading">
      <SectionHeader title="Công nghệ sử dụng" />

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-surface p-2 shadow-sm transition hover:bg-hover md:flex"
          aria-label="Cuộn trái"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TECH_STACK.map((tech) => (
            <div
              key={tech.id}
              className="flex w-[7.5rem] shrink-0 flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-5"
            >
              <img
                src={tech.iconUrl}
                alt=""
                className="h-10 w-10 object-contain"
                loading="lazy"
              />
              <span className="text-center text-xs font-semibold text-ink">
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-surface p-2 shadow-sm transition hover:bg-hover md:flex"
          aria-label="Cuộn phải"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <h2 id="tech-heading" className="sr-only">
        Công nghệ sử dụng
      </h2>
    </section>
  );
}

export default TechStackCarousel;
