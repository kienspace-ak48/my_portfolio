import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  adminInputClass,
  adminLabelClass,
} from "../adminFormStyles";
import type { GalleryAsset, GalleryUpdatePayload } from "../../../types/gallery";

type Props = {
  asset: GalleryAsset | null;
  saving: boolean;
  onClose: () => void;
  onSave: (id: string, payload: GalleryUpdatePayload) => Promise<void>;
};

export default function GalleryEditModal({
  asset,
  saving,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [folder, setFolder] = useState("");

  useEffect(() => {
    if (!asset) return;
    setTitle(asset.title ?? "");
    setAlt(asset.alt ?? "");
    setFolder(asset.folder ?? "");
  }, [asset]);

  if (!asset) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave(asset!.id, {
      title: title.trim() || null,
      alt: alt.trim() || null,
      folder: folder.trim() || null,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#E7E9EE] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E7E9EE] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Chỉnh sửa media</h2>
            <p className="text-xs text-slate-500">Cập nhật metadata — URL giữ nguyên trong DB</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="overflow-hidden rounded-xl border border-[#E7E9EE] bg-slate-50">
            {asset.mediaType === "VIDEO" ? (
              <video
                src={asset.mediaUrl}
                controls
                className="max-h-48 w-full bg-black object-contain"
              />
            ) : (
              <img
                src={asset.mediaUrl}
                alt={asset.alt ?? asset.title ?? ""}
                className="max-h-48 w-full object-contain"
              />
            )}
          </div>

          <div>
            <label className={adminLabelClass} htmlFor="gallery-title">
              Tiêu đề
            </label>
            <input
              id="gallery-title"
              className={adminInputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tên hiển thị"
            />
          </div>

          <div>
            <label className={adminLabelClass} htmlFor="gallery-alt">
              Alt text
            </label>
            <input
              id="gallery-alt"
              className={adminInputClass}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Mô tả cho accessibility / SEO"
            />
          </div>

          <div>
            <label className={adminLabelClass} htmlFor="gallery-folder">
              Nhóm / folder
            </label>
            <input
              id="gallery-folder"
              className={adminInputClass}
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="Ví dụ: portfolio, banner, demo"
            />
          </div>

          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">URL: </span>
            <span className="break-all">{asset.mediaUrl}</span>
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E7E9EE] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {saving ? "Đang lưu…" : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
