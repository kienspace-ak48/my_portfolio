import {
  Copy,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import type { GalleryAsset } from "../../../types/gallery";

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type Props = {
  asset: GalleryAsset;
  onEdit: (asset: GalleryAsset) => void;
  onDelete: (asset: GalleryAsset) => void;
  onPreview: (asset: GalleryAsset) => void;
  onCopyUrl: (url: string) => void;
};

export default function GalleryAssetCard({
  asset,
  onEdit,
  onDelete,
  onPreview,
  onCopyUrl,
}: Props) {
  const previewSrc = asset.thumbnailUrl ?? asset.mediaUrl;
  const isVideo = asset.mediaType === "VIDEO";

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E7E9EE] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => onPreview(asset)}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100"
      >
        <img
          src={previewSrc}
          alt={asset.alt ?? asset.title ?? "Gallery media"}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${
            isVideo ? "bg-violet-600" : "bg-emerald-600"
          }`}
        >
          {isVideo ? <Film size={11} /> : <ImageIcon size={11} />}
          {asset.mediaType}
        </span>

        {asset.folder && (
          <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {asset.folder}
          </span>
        )}

        {isVideo && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
              <Film size={22} />
            </span>
          </span>
        )}
      </button>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {asset.title || "Không có tiêu đề"}
          </h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {asset.width && asset.height
              ? `${asset.width}×${asset.height} · `
              : ""}
            {formatBytes(asset.fileSize)} · {formatDate(asset.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Sao chép URL"
            onClick={() => onCopyUrl(asset.mediaUrl)}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#E7E9EE] px-2 py-1.5 text-xs font-medium text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
          >
            <Copy size={13} />
            URL
          </button>
          <button
            type="button"
            title="Mở tab mới"
            onClick={() => window.open(asset.mediaUrl, "_blank")}
            className="inline-flex items-center justify-center rounded-lg border border-[#E7E9EE] p-1.5 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ExternalLink size={14} />
          </button>
          <button
            type="button"
            title="Chỉnh sửa"
            onClick={() => onEdit(asset)}
            className="inline-flex items-center justify-center rounded-lg border border-[#E7E9EE] p-1.5 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            title="Xóa"
            onClick={() => onDelete(asset)}
            className="inline-flex items-center justify-center rounded-lg border border-[#E7E9EE] p-1.5 text-red-500 transition hover:border-red-200 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
