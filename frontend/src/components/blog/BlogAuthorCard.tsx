import type { BlogAuthor } from "../../types/blog";

function BlogAuthorCard({ author }: { author: BlogAuthor }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <img
        src={author.avatarUrl}
        alt=""
        className="h-14 w-14 shrink-0 rounded-xl object-cover"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
          Tác giả
        </p>
        <p className="mt-1 font-bold text-ink">{author.name}</p>
        <p className="text-sm text-brand">{author.role}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{author.bio}</p>
      </div>
    </div>
  );
}

export default BlogAuthorCard;
