import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CloudUpload,
  Image as ImageIcon,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import * as galleryApi from "../../../api/gallery.api";
import type { GalleryAsset } from "../../../types/gallery";
import { adminInputClass } from "../adminFormStyles";

export type GalleryPickMeta = {
  alt?: string | null;
  title?: string | null;
  width?: number | null;
  height?: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, meta?: GalleryPickMeta) => void;
  selectedUrl?: string;
  imagesOnly?: boolean;
  allowUpload?: boolean;
  uploadFolder?: string;
  title?: string;
  description?: string;
};

export default function GalleryPickerModal({
  open,
  onClose,
  onSelect,
  selectedUrl = "",
  imagesOnly = true,
  allowUpload = false,
  uploadFolder = "content",
  title = "Chọn ảnh từ Gallery",
  description = "Chọn một ảnh đã upload — URL lưu trong database",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pendingUrl, setPendingUrl] = useState(selectedUrl);

  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await galleryApi.getGalleryAdmin();
      setAssets(res.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setPendingUrl(selectedUrl);
    setSearch("");
    loadGallery();
  }, [open, selectedUrl, loadGallery]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (imagesOnly && a.mediaType !== "IMAGE") return false;
      if (!q) return true;
      return (
        (a.title?.toLowerCase().includes(q) ?? false) ||
        (a.alt?.toLowerCase().includes(q) ?? false) ||
        (a.folder?.toLowerCase().includes(q) ?? false) ||
        a.mediaUrl.toLowerCase().includes(q)
      );
    });
  }, [assets, imagesOnly, search]);

  function handleConfirm() {
    if (!pendingUrl) return;
    const asset = assets.find((a) => a.mediaUrl === pendingUrl);
    onSelect(pendingUrl, asset ? {
      alt: asset.alt,
      title: asset.title,
      width: asset.width,
      height: asset.height,
    } : undefined);
    onClose();
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const res = await galleryApi.uploadGalleryAsset(file, {
        folder: uploadFolder,
        title: file.name,
      });
      const asset = res.data;
      setAssets((prev) => [asset, ...prev]);
      setPendingUrl(asset.mediaUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E7E9EE] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E7E9EE] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {allowUpload ? (
          <div className="flex flex-wrap items-center gap-3 border-b border-[#E7E9EE] bg-[#F8F9FB] px-5 py-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CloudUpload size={14} />
              )}
              {uploading ? "Đang upload Cloudinary…" : "Upload ảnh mới"}
            </button>
            <span className="text-xs text-slate-500">
              Upload qua Gallery → lấy link chèn vào bài viết
            </span>
          </div>
        ) : null}

        <div className="border-b border-[#E7E9EE] px-5 py-3">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, folder, URL…"
              className={`${adminInputClass} py-2.5 pl-9`}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <Loader2 size={28} className="mb-3 animate-spin text-amber-600" />
              <p className="text-sm">Đang tải gallery…</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                type="button"
                onClick={loadGallery}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E7E9EE] px-6 py-14 text-center">
              <ImageIcon className="mx-auto mb-3 text-slate-300" size={36} />
              <p className="font-medium text-slate-700">
                {assets.length === 0
                  ? allowUpload
                    ? "Gallery trống — upload ảnh ở trên hoặc mở trang Gallery"
                    : "Gallery trống — hãy upload ảnh trước"
                  : "Không có ảnh phù hợp"}
              </p>
              {!allowUpload ? (
                <Link
                  to="/admin/gallery"
                  onClick={onClose}
                  className="mt-3 inline-block text-sm font-medium text-amber-700 hover:underline"
                >
                  Mở trang Gallery để upload →
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((asset) => {
                const selected = pendingUrl === asset.mediaUrl;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setPendingUrl(asset.mediaUrl)}
                    className={`group relative overflow-hidden rounded-xl border-2 text-left transition ${
                      selected
                        ? "border-amber-500 ring-2 ring-amber-500/20"
                        : "border-[#E7E9EE] hover:border-amber-300"
                    }`}
                  >
                    <div className="aspect-[4/3] bg-slate-100">
                      <img
                        src={asset.thumbnailUrl ?? asset.mediaUrl}
                        alt={asset.alt ?? asset.title ?? ""}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {selected && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white shadow">
                        <Check size={14} />
                      </span>
                    )}

                    <div className="border-t border-[#E7E9EE] bg-white p-2">
                      <p className="truncate text-xs font-medium text-slate-800">
                        {asset.title || "Không có tiêu đề"}
                      </p>
                      {asset.folder && (
                        <p className="truncate text-[10px] text-slate-400">
                          {asset.folder}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E7E9EE] px-5 py-4">
          <p className="min-w-0 flex-1 truncate text-xs text-slate-500">
            {pendingUrl ? (
              <>
                <span className="font-medium text-slate-700">Đã chọn: </span>
                {pendingUrl}
              </>
            ) : (
              "Chưa chọn ảnh"
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E7E9EE] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={!pendingUrl}
              onClick={handleConfirm}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
