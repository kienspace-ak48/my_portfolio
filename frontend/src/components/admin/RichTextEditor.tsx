import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Maximize2, Minimize2, X } from "lucide-react";
import {
  TINYMCE_BASE_URL,
  TINYMCE_SCRIPT_SRC,
} from "../../configs/tinymce.config";
import { theme } from "../../configs/theme.config";
import {
  ARTICLE_IMAGE_MAX_WIDTH,
  buildArticleImageHtml,
  type ArticleImageMeta,
} from "../../utils/articleImage";
import GalleryPickerModal from "./gallery/GalleryPickerModal";
import PasteHtmlModal, { looksLikeHtml } from "./gallery/PasteHtmlModal";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  focusTitle?: string;
};

type EditorInstance = {
  insertContent: (html: string) => void;
  setContent: (html: string) => void;
  getContent: () => string;
  focus: () => void;
};

type TinyMceSetupEditor = EditorInstance & {
  ui: {
    registry: {
      addButton: (
        name: string,
        spec: { text: string; tooltip: string; onAction: () => void },
      ) => void;
    };
  };
  on: (event: "paste", handler: (e: ClipboardEvent) => void) => void;
};

type EditorSurfaceProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height: number;
  minHeight: number;
  maxHeight: number;
  editorRef: MutableRefObject<EditorInstance | null>;
  onOpenGallery: () => void;
  onOpenPasteHtml: () => void;
  shellClassName?: string;
};

function EditorSurface({
  value,
  onChange,
  placeholder,
  height,
  minHeight,
  maxHeight,
  editorRef,
  onOpenGallery,
  onOpenPasteHtml,
  shellClassName = "",
}: EditorSurfaceProps) {
  const openGalleryRef = useRef(onOpenGallery);
  const openPasteHtmlRef = useRef(onOpenPasteHtml);
  openGalleryRef.current = onOpenGallery;
  openPasteHtmlRef.current = onOpenPasteHtml;

  const editorContentStyle = [
    `body { font-family: ${theme.font}; font-size: 14px; line-height: 1.6; max-width: ${ARTICLE_IMAGE_MAX_WIDTH}px; margin: 0 auto; }`,
    "img.article-image { max-width: 100%; height: auto; border-radius: 8px; cursor: default; }",
    "img.article-image[style*='float: left'], img.article-image[style*='float:left'] { margin: 0.25rem 1rem 0.5rem 0; }",
    "img.article-image[style*='float: right'], img.article-image[style*='float:right'] { margin: 0.25rem 0 0.5rem 1rem; }",
    "img.article-image[style*='display: block'], img.article-image[style*='margin-left: auto'] { margin-top: 0.75rem; margin-bottom: 0.75rem; }",
  ].join(" ");

  return (
    <div
      className={`rich-text-editor-shell rounded-lg border border-[#E7E9EE] ${shellClassName}`}
    >
      <Editor
        tinymceScriptSrc={TINYMCE_SCRIPT_SRC}
        licenseKey="gpl"
        value={value}
        onEditorChange={onChange}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        init={{
          base_url: TINYMCE_BASE_URL,
          suffix: ".min",
          height,
          min_height: minHeight,
          max_height: maxHeight,
          resize: true,
          statusbar: true,
          menubar: false,
          placeholder,
          plugins: [
            "lists",
            "link",
            "image",
            "quickbars",
            "table",
            "searchreplace",
            "wordcount",
          ].join(" "),
          toolbar:
            "undo redo | blocks | bold italic underline | galleryimage pastehtml | alignleft aligncenter alignright | bullist numlist | link image table",
          branding: false,
          promotion: false,
          object_resizing: "img",
          resize_img_proportional: true,
          quickbars_selection_toolbar: "bold italic | quicklink blockquote",
          quickbars_image_toolbar: "alignleft aligncenter alignright | image",
          image_caption: false,
          image_advtab: true,
          smart_paste: true,
          paste_as_text: false,
          content_style: editorContentStyle,
          setup: (editor: TinyMceSetupEditor) => {
            editor.ui.registry.addButton("galleryimage", {
              text: "Ảnh",
              tooltip: "Chèn ảnh từ Gallery / Upload Cloudinary",
              onAction: () => openGalleryRef.current(),
            });

            editor.ui.registry.addButton("pastehtml", {
              text: "HTML",
              tooltip: "Dán HTML từ Cursor (modal textarea)",
              onAction: () => openPasteHtmlRef.current(),
            });

            editor.on("paste", (e: ClipboardEvent) => {
              const clipboard = e.clipboardData;
              if (!clipboard) return;

              const plain = clipboard.getData("text/plain");
              const rich = clipboard.getData("text/html");

              if (plain && looksLikeHtml(plain) && !rich.trim()) {
                e.preventDefault();
                editor.insertContent(plain);
              }
            });
          },
        }}
      />
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  height = 400,
  minHeight,
  maxHeight = 960,
  focusTitle = "Soạn nội dung",
}: Props) {
  const editorMinHeight = minHeight ?? Math.min(height, 280);
  const editorRef = useRef<EditorInstance | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [pasteHtmlOpen, setPasteHtmlOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [focusHeight, setFocusHeight] = useState(720);

  const openGallery = useCallback(() => setGalleryOpen(true), []);
  const openPasteHtml = useCallback(() => setPasteHtmlOpen(true), []);

  const updateFocusHeight = useCallback(() => {
    setFocusHeight(Math.max(window.innerHeight - 128, 420));
  }, []);

  useEffect(() => {
    if (!focusMode) return;

    updateFocusHeight();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusMode(false);
    };
    window.addEventListener("resize", updateFocusHeight);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("resize", updateFocusHeight);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [focusMode, updateFocusHeight]);

  function insertImage(url: string, meta?: ArticleImageMeta) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.insertContent(buildArticleImageHtml(url, meta));
    editor.focus();
  }

  function applyHtml(html: string) {
    const editor = editorRef.current;
    if (editor) {
      editor.setContent(html);
      onChange(html);
      editor.focus();
    } else {
      onChange(html);
    }
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setFocusMode(true)}
          className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-lg border border-[#E7E9EE] bg-white/95 px-2 py-1 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
          title="Phóng to toàn màn hình để focus viết"
        >
          <Maximize2 size={13} />
          Focus
        </button>

        {!focusMode ? (
          <EditorSurface
            key="inline"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            height={height}
            minHeight={editorMinHeight}
            maxHeight={maxHeight}
            editorRef={editorRef}
            onOpenGallery={openGallery}
            onOpenPasteHtml={openPasteHtml}
          />
        ) : (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#E7E9EE] bg-[#F8F9FB] py-16 text-sm text-slate-500">
            Đang soạn ở chế độ Focus — bấm Thu nhỏ hoặc Esc để quay lại
          </div>
        )}
      </div>

      {focusMode ? (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#F8F9FB]">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E7E9EE] bg-white px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                Focus mode
              </p>
              <h2 className="truncate text-base font-bold text-slate-900">
                {focusTitle}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-slate-400 sm:inline">
                Esc để thoát
              </span>
              <button
                type="button"
                onClick={() => setFocusMode(false)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Minimize2 size={14} />
                Thu nhỏ
              </button>
              <button
                type="button"
                onClick={() => setFocusMode(false)}
                aria-label="Đóng focus mode"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
            <div className="mx-auto max-w-5xl">
              <EditorSurface
                key="focus"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                height={focusHeight}
                minHeight={420}
                maxHeight={focusHeight}
                editorRef={editorRef}
                onOpenGallery={openGallery}
                onOpenPasteHtml={openPasteHtml}
                shellClassName="shadow-sm"
              />
            </div>
          </div>
        </div>
      ) : null}

      <GalleryPickerModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        allowUpload
        uploadFolder="content"
        title="Chèn ảnh vào bài viết"
        description="Chọn ảnh có sẵn trong Gallery hoặc upload mới lên Cloudinary"
        onSelect={(url, meta) => {
          insertImage(url, meta);
        }}
      />

      <PasteHtmlModal
        open={pasteHtmlOpen}
        initialHtml={value}
        onClose={() => setPasteHtmlOpen(false)}
        onApply={applyHtml}
        mode="replace"
      />
    </>
  );
}
