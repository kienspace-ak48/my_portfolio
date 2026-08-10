import { MessageSquare } from "lucide-react";
import useBlogComments from "../../hooks/useBlogComments";
import type { BlogCommentSort } from "../../types/blog";
import BlogCommentForm from "./BlogCommentForm";
import BlogCommentItem from "./BlogCommentItem";

type BlogCommentsSectionProps = {
  postId: string;
};

const SORT_OPTIONS: { value: BlogCommentSort; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "popular", label: "Nhiều thích" },
];

function BlogCommentsSection({ postId }: BlogCommentsSectionProps) {
  const {
    ready,
    sort,
    setSort,
    topLevel,
    repliesByParent,
    totalCount,
    likedIds,
    addComment,
    addReply,
    toggleLike,
  } = useBlogComments(postId);

  if (!ready) return null;

  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="scroll-mt-24 border-t border-border pt-10"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-brand" aria-hidden />
          <h2 id="comments-heading" className="text-xl font-bold text-ink">
            Bình luận
            <span className="ml-2 text-base font-normal text-muted">
              ({totalCount})
            </span>
          </h2>
        </div>

        {totalCount > 0 ? (
          <div className="flex rounded-xl border border-border bg-app p-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSort(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  sort === opt.value
                    ? "bg-surface text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <BlogCommentForm onSubmit={addComment} />

      {topLevel.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border bg-app/50 px-5 py-10 text-center text-sm text-muted">
          Chưa có bình luận — hãy là người đầu tiên!
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {topLevel.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
            >
              <BlogCommentItem
                comment={comment}
                replies={repliesByParent.get(comment.id) ?? []}
                isLiked={likedIds.has(comment.id)}
                onLike={() => toggleLike(comment.id)}
                onReply={(input) => addReply(comment.id, input)}
                isReplyLiked={(id) => likedIds.has(id)}
                onReplyLike={toggleLike}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default BlogCommentsSection;
