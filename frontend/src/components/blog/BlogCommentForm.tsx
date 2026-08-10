import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

type BlogCommentFormProps = {
  placeholder?: string;
  submitLabel?: string;
  onSubmit: (input: {
    authorName: string;
    authorEmail?: string;
    content: string;
  }) => void;
  onCancel?: () => void;
  compact?: boolean;
};

function BlogCommentForm({
  placeholder = "Chia sẻ suy nghĩ của bạn...",
  submitLabel = "Gửi bình luận",
  onSubmit,
  onCancel,
  compact = false,
}: BlogCommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim()) {
      setError("Vui lòng nhập tên.");
      return;
    }
    if (!content.trim()) {
      setError("Nội dung không được để trống.");
      return;
    }
    if (content.trim().length < 3) {
      setError("Bình luận quá ngắn.");
      return;
    }
    setError("");
    onSubmit({
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim() || undefined,
      content: content.trim(),
    });
    setContent("");
    if (compact) {
      setAuthorName("");
      setAuthorEmail("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-border bg-surface ${compact ? "p-4" : "p-5 sm:p-6"}`}
    >
      {!compact ? (
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-brand" aria-hidden />
          <h3 className="font-bold text-ink">Viết bình luận</h3>
        </div>
      ) : null}

      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Tên của bạn *"
          className="rounded-xl border border-border bg-app px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        <input
          type="email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          placeholder="Email (tuỳ chọn)"
          className="rounded-xl border border-border bg-app px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 3 : 4}
        className="mt-3 w-full resize-y rounded-xl border border-border bg-app px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
      />

      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          <Send size={15} aria-hidden />
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-hover"
          >
            Huỷ
          </button>
        ) : null}
        {!compact ? (
          <p className="ml-auto text-xs text-subtle">
            Demo frontend — lưu tạm trên trình duyệt
          </p>
        ) : null}
      </div>
    </form>
  );
}

export default BlogCommentForm;
