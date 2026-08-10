import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import useStories from "../hooks/useStories";
import StoryViewerModal from "./StoryViewrModal";
import { getUserAvatarUrl, groupStoriesByUser } from "../utils/storyGroups";
import { InlineLoading } from "./LoadingKit";

const banners = [
  "https://picsum.photos/1400/420?11",
  "https://picsum.photos/1400/420?12",
  "https://picsum.photos/1400/420?13",
];

const NewsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const { stories, loading, error } = useStories();
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);

  const storyGroups = useMemo(() => groupStoriesByUser(stories), [stories]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="space-y-10">
      <div>
        <h2 className="mb-5 text-2xl font-bold">Tin</h2>

        {loading && (
          <InlineLoading message="Đang tải stories…" />
        )}
        {!!error && <p className="text-sm text-red-500">Không tải được stories</p>}

        {!loading && !error && storyGroups.length === 0 && (
          <p className="text-sm text-muted">
            Chưa có story đang hoạt động. Chạy{" "}
            <code className="rounded bg-hover px-1.5 py-0.5 text-xs">
              pnpm run seed
            </code>{" "}
            ở backend để tạo dữ liệu mẫu.
          </p>
        )}

        {!loading && !error && storyGroups.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {storyGroups.map((group, index) => (
                <button
                  key={group.user.id}
                  type="button"
                  className="flex w-[88px] shrink-0 flex-col items-center gap-2"
                  onClick={() => setActiveGroupIndex(index)}
                >
                  <div className="rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] p-[3px]">
                    <div className="rounded-full bg-white p-[2px]">
                      <img
                        src={getUserAvatarUrl(group.user.id)}
                        className="h-[72px] w-[72px] rounded-full object-cover"
                        alt={group.user.name}
                      />
                    </div>
                  </div>

                  <div className="flex max-w-full items-center gap-0.5">
                    <span className="truncate text-xs font-medium text-slate-800">
                      {group.user.name ?? "Người dùng"}
                    </span>
                    <CheckCircle2 size={12} className="shrink-0 fill-blue-500 text-white" />
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="min-w-full">
              <img
                src={banner}
                className="h-[340px] w-full object-cover"
                alt=""
              />
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg hover:bg-white"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg hover:bg-white"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index ? "w-8 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {activeGroupIndex !== null && (
        <StoryViewerModal
          groups={storyGroups}
          initialGroupIndex={activeGroupIndex}
          onClose={() => setActiveGroupIndex(null)}
        />
      )}
    </section>
  );
};

export default NewsSection;
