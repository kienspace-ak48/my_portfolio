import { useEffect, useRef, useState } from "react";
import { ClipboardPaste, X } from "lucide-react";
import { adminInputClass, adminLabelClass } from "../adminFormStyles";

type Props = {
  open: boolean;
  initialHtml?: string;
  onClose: () => void;
  onApply: (html: string) => void;
  mode?: "replace" | "insert";
};

function looksLikeHtml(text: string) {
  const t = text.trim();
  if (!t.includes("<") || !t.includes(">")) return false;
  return /<\/?[a-z][\s\S]*>/i.test(t);
}

export { looksLikeHtml };

export default function PasteHtmlModal({
  open,
  initialHtml = "",
  onClose,
  onApply,
  mode = "replace",
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [html, setHtml] = useState(initialHtml);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setHtml(initialHtml);
    setError(null);
    const t = window.setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }, 50);
    return () => window.clearTimeout(t);
  }, [open, initialHtml]);

  function handleApply() {
    const trimmed = html.trim();
    if (!trimmed) {
      setError("Chưa có nội dung HTML");
      return;
    }
    if (!looksLikeHtml(trimmed)) {
      setError("Nội dung không giống HTML — thử copy lại từ Cursor");
      return;
    }
    onApply(trimmed);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E7E9EE] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E7E9EE] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Dán HTML
            </h2>
            <p className="text-xs text-slate-500">
              Ctrl+V vào ô bên dưới — thay modal Source Code của TinyMCE (hay bị lỗi paste)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-5">
          <label className={adminLabelClass} htmlFor="paste-html-area">
            HTML từ Cursor / AI ({mode === "replace" ? "thay toàn bộ" : "chèn tại con trỏ"})
          </label>
          <textarea
            id="paste-html-area"
            ref={textareaRef}
            value={html}
            onChange={(e) => {
              setHtml(e.target.value);
              setError(null);
            }}
            placeholder="<h2>Tiêu đề</h2>&#10;<p>Đoạn văn...</p>"
            className={`${adminInputClass} min-h-[320px] resize-y font-mono text-xs leading-relaxed`}
            spellCheck={false}
          />
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="text-xs text-slate-400">
              Mẹo: copy HTML từ Cursor → click vào ô trên → Ctrl+V
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E7E9EE] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E7E9EE] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            <ClipboardPaste size={15} />
            Áp dụng HTML
          </button>
        </div>
      </div>
    </div>
  );
}
