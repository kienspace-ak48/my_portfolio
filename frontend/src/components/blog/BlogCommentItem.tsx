import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { BlogComment } from "../../types/blog";
import { formatBlogDate } from "../../utils/blogUtils";
import BlogCommentForm from "./BlogCommentForm";

type BlogCommentItemProps = {
  comment: BlogComment;
  replies: BlogComment[];
  isLiked: boolean;
  onLike: () => void;
  onReply: (input: {
    authorName: string;
    authorEmail?: string;
    content: string;
  }) => void;
  isReplyLiked: (id: string) => boolean;
  onReplyLike: (id: string) => void;
  nested?: boolean;
};

function BlogCommentItem({
  comment,
  replies,
  isLiked,
  onLike,
  onReply,
  isReplyLiked,
  onReplyLike,
  nested = false,
}: BlogCommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <article
      className={nested ? "border-l-2 border-border pl-4 sm:pl-5" : undefined}
    >
      <div className="flex gap-3 sm:gap-4">
        <img
          src={comment.avatarUrl}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-surface sm:h-10 sm:w-10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-semibold text-ink">{comment.authorName}</span>
            <time dateTime={comment.createdAt} className="text-xs text-subtle">
              {formatBlogDate(comment.createdAt)}
            </time>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-body sm:text-[15px]">
            {comment.content}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onLike}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition ${
                isLiked
                  ? "bg-rose-50 text-rose-600"
                  : "text-muted hover:bg-hover hover:text-ink"
              }`}
            >
              <Heart
                size={14}
                className={isLiked ? "fill-current" : ""}
                aria-hidden
              />
              {comment.likes > 0 ? comment.likes : "Thích"}
            </button>

            {!nested ? (
              <button
                type="button"
                onClick={() => setReplyOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted transition hover:bg-hover hover:text-ink"
              >
                <MessageCircle size={14} aria-hidden />
                Trả lời
                {replies.length > 0 ? ` (${replies.length})` : ""}
              </button>
            ) : null}
          </div>

          {replyOpen ? (
            <div className="mt-4">
              <BlogCommentForm
                compact
                placeholder="Viết phản hồi..."
                submitLabel="Gửi trả lời"
                onCancel={() => setReplyOpen(false)}
                onSubmit={(input) => {
                  onReply(input);
                  setReplyOpen(false);
                }}
              />
            </div>
          ) : null}

          {replies.length > 0 ? (
            <div className="mt-5 space-y-5">
              {replies.map((reply) => (
                <BlogCommentItem
                  key={reply.id}
                  comment={reply}
                  replies={[]}
                  isLiked={isReplyLiked(reply.id)}
                  onLike={() => onReplyLike(reply.id)}
                  onReply={() => {}}
                  isReplyLiked={isReplyLiked}
                  onReplyLike={onReplyLike}
                  nested
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default BlogCommentItem;
