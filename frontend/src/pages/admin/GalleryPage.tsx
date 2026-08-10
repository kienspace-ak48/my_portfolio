import { useCallback, useMemo, useState } from "react";
import {
  Film,
  Image as ImageIcon,
  LayoutGrid,
  RefreshCw,
  Search,
} from "lucide-react";
import GalleryUploadZone from "../../components/admin/gallery/GalleryUploadZone";
import GalleryAssetCard from "../../components/admin/gallery/GalleryAssetCard";
import GalleryEditModal from "../../components/admin/gallery/GalleryEditModal";
import GalleryPreviewModal from "../../components/admin/gallery/GalleryPreviewModal";
import useGallery from "../../hooks/useGallery";
import type { GalleryAsset, GalleryFilter } from "../../types/gallery";
import { PageLoading } from "../../components/LoadingKit";

const FILTERS: { id: GalleryFilter; label: string; icon: typeof ImageIcon }[] = [
  { id: "ALL", label: "Tất cả", icon: LayoutGrid },
  { id: "IMAGE", label: "Ảnh", icon: ImageIcon },
  { id: "VIDEO", label: "Video", icon: Film },
];

export default function GalleryPage() {
  const {
    assets,
    loading,
    error,
    uploading,
    fetchGallery,
    uploadAsset,
    updateAsset,
    deleteAsset,
  } = useGallery();

  const [filter, setFilter] = useState<GalleryFilter>("ALL");
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<GalleryAsset | null>(null);
  const [previewTarget, setPreviewTarget] = useState<GalleryAsset | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const stats = useMemo(
    () => ({
      total: assets.length,
      images: assets.filter((a) => a.mediaType === "IMAGE").length,
      videos: assets.filter((a) => a.mediaType === "VIDEO").length,
    }),
    [assets],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (filter !== "ALL" && a.mediaType !== filter) return false;
      if (!q) return true;
      return (
        (a.title?.toLowerCase().includes(q) ?? false) ||
        (a.alt?.toLowerCase().includes(q) ?? false) ||
        (a.folder?.toLowerCase().includes(q) ?? false) ||
        a.mediaUrl.toLowerCase().includes(q)
      );
    });
  }, [assets, filter, search]);

  async function handleUpload(files: FileList) {
    const list = Array.from(files);
    let ok = 0;
    for (const file of list) {
      try {
        await uploadAsset(file);
        ok += 1;
      } catch (e) {
        showToast(
          e instanceof Error ? e.message : `Upload thất bại: ${file.name}`,
        );
      }
    }
    if (ok > 0) {
      showToast(`Đã upload ${ok} file lên Cloudinary`);
    }
  }

  async function handleSave(
    id: string,
    payload: Parameters<typeof updateAsset>[1],
  ) {
    setSaving(true);
    try {
      await updateAsset(id, payload);
      showToast("Đã cập nhật metadata");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(asset: GalleryAsset) {
    const label = asset.title || asset.mediaUrl.split("/").pop() || "media";
    if (!window.confirm(`Xóa "${label}"? File trên Cloudinary cũng sẽ bị xóa.`)) {
      return;
    }
    try {
      await deleteAsset(asset.id);
      showToast("Đã xóa media");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Xóa thất bại");
    }
  }

  async function handleCopyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Đã sao chép URL");
    } catch {
      showToast("Không thể sao chép — thử copy thủ công");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Thư viện Media</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload lên Cloudinary · lưu URL vào database · quản lý CRUD
          </p>
        </header>
        <PageLoading
          variant="embedded"
          title="Đang tải gallery"
          message="Đang lấy danh sách media từ database…"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thư viện Media</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload lên Cloudinary · lưu URL vào database · quản lý CRUD
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-xl border border-[#E7E9EE] bg-white px-4 py-2 text-center">
            <p className="text-lg font-bold text-slate-900">{stats.total}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Tổng
            </p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-center">
            <p className="text-lg font-bold text-emerald-800">{stats.images}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600/80">
              Ảnh
            </p>
          </div>
          <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-2 text-center">
            <p className="text-lg font-bold text-violet-800">{stats.videos}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600/80">
              Video
            </p>
          </div>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
          <p className="font-medium text-red-800">{error}</p>
          <button
            type="button"
            onClick={() => fetchGallery()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <RefreshCw size={14} />
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <GalleryUploadZone uploading={uploading} onUpload={handleUpload} />

          <div className="flex flex-col gap-3 rounded-2xl border border-[#E7E9EE] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0 flex-1 sm:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, alt, folder, URL…"
                className="w-full rounded-xl border border-[#E7E9EE] py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
              />
            </div>

            <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
              {FILTERS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    filter === id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E7E9EE] bg-white px-6 py-16 text-center">
              <LayoutGrid className="mx-auto mb-3 text-slate-300" size={40} />
              <p className="font-medium text-slate-700">
                {assets.length === 0
                  ? "Chưa có media nào — hãy upload file đầu tiên"
                  : "Không có kết quả phù hợp bộ lọc"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Media được lưu URL trong bảng gallery_asset
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((asset) => (
                <GalleryAssetCard
                  key={asset.id}
                  asset={asset}
                  onEdit={setEditTarget}
                  onDelete={handleDelete}
                  onPreview={setPreviewTarget}
                  onCopyUrl={handleCopyUrl}
                />
              ))}
            </div>
          )}
        </>
      )}

      <GalleryEditModal
        asset={editTarget}
        saving={saving}
        onClose={() => setEditTarget(null)}
        onSave={handleSave}
      />

      <GalleryPreviewModal
        asset={previewTarget}
        onClose={() => setPreviewTarget(null)}
      />
    </div>
  );
}
