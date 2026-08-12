import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import GalleryPickerModal from "../gallery/GalleryPickerModal";

type Props = {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  compact?: boolean;
  previewAspect?: "og" | "square";
  emptyLabel?: string;
  galleryTitle?: string;
  galleryDescription?: string;
  uploadFolder?: string;
  urlPlaceholder?: string;
};

const inputClass =
  "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand";

export default function SeoOgImageField({
  label,
  hint,
  value,
  onChange,
  compact = false,
  previewAspect = "og",
  emptyLabel = "Chưa chọn ảnh OG",
  galleryTitle = "Chọn ảnh OG",
  galleryDescription = "JPG/PNG — Zalo/Facebook không preview AVIF/WebP/SVG",
  uploadFolder = "seo",
  urlPlaceholder = "https://…/og-image.jpg (JPG/PNG, 1200×630 khuyến nghị)",
}: Props) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const aspectClass = previewAspect === "square" ? "aspect-square" : "aspect-[1.91/1]";
  const previewMax = compact
    ? previewAspect === "square"
      ? "max-w-[120px]"
      : "max-w-[280px]"
    : previewAspect === "square"
      ? "max-w-[160px]"
      : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-rose-600"
          >
            <X size={12} aria-hidden />
            Xóa
          </button>
        ) : null}
      </div>

      {value ? (
        <div
          className={`overflow-hidden rounded-xl border border-border bg-app ${previewMax}`}
        >
          <div className={`${aspectClass} bg-hover`}>
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <p className="truncate px-2 py-1.5 font-mono-ui text-[10px] text-muted">
            {value}
          </p>
        </div>
      ) : (
        <div
          className={`flex ${aspectClass} ${previewMax || "max-w-[280px]"} items-center justify-center rounded-xl border border-dashed border-border bg-app text-xs text-muted`}
        >
          {emptyLabel}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGalleryOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-border bg-brand-soft px-3 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white"
        >
          <ImageIcon size={15} aria-hidden />
          Chọn từ Gallery
        </button>
      </div>

      <input
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={urlPlaceholder}
      />
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}

      <GalleryPickerModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        selectedUrl={value}
        allowUpload
        uploadFolder={uploadFolder}
        title={galleryTitle}
        description={galleryDescription}
        onSelect={(url) => {
          onChange(url);
          setGalleryOpen(false);
        }}
      />
    </div>
  );
}
