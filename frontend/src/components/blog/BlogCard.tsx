import { Link } from "react-router-dom";
import type { BlogPost } from "../../types/blog";
import { blogCategoryLabel } from "../../types/blog";
import { formatBlogDate } from "../../utils/blogUtils";

type BlogCardProps = {
  post: BlogPost;
  variant?: "default" | "compact" | "horizontal";
};

function BlogCard({ post, variant = "default" }: BlogCardProps) {
  if (variant === "horizontal") {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group flex gap-4 rounded-2xl border border-border bg-surface p-3 transition hover:border-brand-border hover:shadow-sm sm:gap-5 sm:p-4"
      >
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt=""
            className="h-24 w-28 shrink-0 rounded-xl object-cover sm:h-28 sm:w-36"
            loading="lazy"
          />
        ) : (
          <div
            className="h-24 w-28 shrink-0 rounded-xl bg-hover sm:h-28 sm:w-36"
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1 py-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">
            {blogCategoryLabel(post)}
          </span>
          <h3 className="mt-1 line-clamp-2 font-bold text-ink group-hover:text-brand">
            {post.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
          <p className="mt-2 text-xs text-subtle">
            {formatBlogDate(post.publishedAt)} · {post.readMinutes} phút đọc
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group block rounded-xl py-2 transition hover:bg-hover/80"
      >
        <p className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-brand">
          {post.title}
        </p>
        <p className="mt-1 text-xs text-subtle">
          {formatBlogDate(post.publishedAt)}
        </p>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-brand-border hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-hover">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-lg bg-surface/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand shadow-sm backdrop-blur-sm">
          {blogCategoryLabel(post)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink group-hover:text-brand sm:text-lg">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-app px-2 py-0.5 text-[11px] font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="ml-auto text-xs text-subtle">
            {post.readMinutes} phút
          </span>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
