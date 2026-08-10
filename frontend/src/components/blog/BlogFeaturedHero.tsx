import { Link } from "react-router-dom";
import type { BlogPost } from "../../types/blog";
import { BLOG_CATEGORY_LABELS } from "../../types/blog";
import { formatBlogDate } from "../../utils/blogUtils";

type BlogFeaturedHeroProps = {
  post: BlogPost;
};

function BlogFeaturedHero({ post }: BlogFeaturedHeroProps) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-3xl bg-ink"
    >
      <img
        src={post.coverUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />

      <div className="relative flex min-h-[320px] flex-col justify-end p-6 sm:min-h-[380px] sm:p-10">
        <span className="mb-3 inline-flex w-fit rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Nổi bật · {BLOG_CATEGORY_LABELS[post.category]}
        </span>
        <h2 className="max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
          {post.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
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

export default BlogFeaturedHero;
