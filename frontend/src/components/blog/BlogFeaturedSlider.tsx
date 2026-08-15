import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../../types/blog";
import { blogCategoryLabel } from "../../types/blog";
import { formatBlogDate } from "../../utils/blogUtils";

type BlogFeaturedSlideProps = {
  post: BlogPost;
};

export function BlogFeaturedSlide({ post }: BlogFeaturedSlideProps) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group relative block h-full min-h-[320px] overflow-hidden rounded-3xl bg-ink sm:min-h-[380px]"
    >
      {post.coverUrl ? (
        <img
          src={post.coverUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-55"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-ink" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />

      <div className="relative flex h-full min-h-[320px] flex-col justify-end p-6 sm:min-h-[380px] sm:p-10">
        <span className="mb-3 inline-flex w-fit rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Nổi bật · {blogCategoryLabel(post)}
        </span>
        <h2 className="max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          {post.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readMinutes} phút đọc</span>
          <span className="ml-auto font-semibold text-brand-soft transition group-hover:text-white">
            Đọc bài →
          </span>
        </div>
      </div>
    </Link>
  );
}

type BlogFeaturedSliderProps = {
  posts: BlogPost[];
};

const AUTO_MS = 7000;

export default function BlogFeaturedSlider({ posts }: BlogFeaturedSliderProps) {
  const [index, setIndex] = useState(0);
  const total = posts.length;

  const go = useCallback(
    (next: number) => {
      if (total <= 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    setIndex(0);
  }, [posts]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [total]);

  if (total === 0) return null;

  if (total === 1) {
    return <BlogFeaturedSlide post={posts[0]} />;
  }

  return (
    <section
      className="relative"
      aria-roledescription="carousel"
      aria-label="Bài viết nổi bật"
    >
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {posts.map((post) => (
            <div key={post.id} className="w-full shrink-0">
              <BlogFeaturedSlide post={post} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Bài trước"
        onClick={() => go(index - 1)}
        className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/50 text-white backdrop-blur-sm transition hover:bg-ink/70 sm:left-4"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Bài sau"
        onClick={() => go(index + 1)}
        className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/50 text-white backdrop-blur-sm transition hover:bg-ink/70 sm:right-4"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-5">
        {posts.map((post, i) => (
          <button
            key={post.id}
            type="button"
            aria-label={`Slide ${i + 1}: ${post.title}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
