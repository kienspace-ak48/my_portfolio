import { useCallback, useRef, useState } from "react";
import { CloudUpload, Film, Image as ImageIcon, Loader2 } from "lucide-react";

type Props = {
  uploading: boolean;
  onUpload: (files: FileList) => void;
};

export default function GalleryUploadZone({ uploading, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length || uploading) return;
      onUpload(files);
    },
    [onUpload, uploading],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
        dragOver
          ? "border-amber-500 bg-amber-50/80"
          : "border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:border-amber-400 hover:bg-amber-50/40"
      } ${uploading ? "pointer-events-none opacity-70" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition ${
            dragOver
              ? "bg-amber-500 text-white"
              : "bg-white text-amber-600 shadow-sm ring-1 ring-slate-200 group-hover:bg-amber-500 group-hover:text-white"
          }`}
        >
          {uploading ? (
            <Loader2 size={26} className="animate-spin" />
          ) : (
            <CloudUpload size={26} />
          )}
        </div>

        <p className="text-base font-semibold text-slate-900">
          {uploading ? "Đang upload lên Cloudinary…" : "Kéo thả hoặc bấm để upload"}
        </p>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          Ảnh & video sẽ lưu trên Cloudinary, đường dẫn URL ghi vào database
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            <ImageIcon size={12} />
            JPG, PNG, WebP
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            <Film size={12} />
            MP4, WebM
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            Tối đa 50MB
          </span>
        </div>
      </div>
    </div>
  );
}
