import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const stories = [
  {
    id: 1,
    name: "Bùi Thị Thuý Dương",
    avatar: "https://i.pravatar.cc/150?img=10",
    story: "https://picsum.photos/220/360?1",
    verified: false,
  },
  {
    id: 2,
    name: "Nga Trần Phương",
    avatar: "https://i.pravatar.cc/150?img=20",
    story: "https://picsum.photos/220/360?2",
    verified: true,
  },
  {
    id: 3,
    name: "Mỹ Anh Đỗ",
    avatar: "https://i.pravatar.cc/150?img=30",
    story: "https://picsum.photos/220/360?3",
    verified: true,
  },
  {
    id: 4,
    name: "Tây Du Code",
    avatar: "https://i.pravatar.cc/150?img=40",
    story: "https://picsum.photos/220/360?4",
    verified: true,
  },
  {
    id: 5,
    name: "React Việt Nam",
    avatar: "https://i.pravatar.cc/150?img=50",
    story: "https://picsum.photos/220/360?5",
    verified: true,
  },
];

const banners = [
  "https://picsum.photos/1400/420?11",
  "https://picsum.photos/1400/420?12",
  "https://picsum.photos/1400/420?13",
];

const NewsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

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

      {/* STORY */}
      <div>
        <h2 className="mb-5 text-2xl font-bold">Tin</h2>

        <div className="flex gap-5 overflow-x-auto pb-2">

          {stories.map((story) => (
            <div
              key={story.id}
              className="w-[170px] shrink-0"
            >
              <div className="relative overflow-hidden rounded-2xl">

                <img
                  src={story.story}
                  className="h-[260px] w-full object-cover"
                  alt=""
                />

                <div className="absolute left-3 top-3 rounded-full border-[3px] border-pink-500 p-[2px]">

                  <img
                    src={story.avatar}
                    className="h-12 w-12 rounded-full object-cover"
                    alt=""
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1">

                <span className="truncate font-semibold">
                  {story.name}
                </span>

                {story.verified && (
                  <CheckCircle2
                    size={16}
                    className="fill-blue-500 text-white"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BANNER */}
      <div className="relative overflow-hidden rounded-3xl">

        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className="min-w-full"
            >
              <img
                src={banner}
                className="h-[340px] w-full object-cover"
                alt=""
              />
            </div>
          ))}
        </div>

        {/* Prev */}
        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg hover:bg-white"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next */}
        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg hover:bg-white"
        >
          <ChevronRight size={22} />
        </button>

        {/* Indicator */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;