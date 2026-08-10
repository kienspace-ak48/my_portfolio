import { X } from "lucide-react";
import type { GalleryAsset } from "../../../types/gallery";

type Props = {
  asset: GalleryAsset | null;
  onClose: () => void;
};

export default function GalleryPreviewModal({ asset, onClose }: Props) {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng preview"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-black shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="min-w-0 pr-4">
            <p className="truncate text-sm font-medium text-white">
              {asset.title || "Gallery preview"}
            </p>
            <p className="truncate text-xs text-white/60">{asset.mediaUrl}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto p-4">
          {asset.mediaType === "VIDEO" ? (
            <video
              src={asset.mediaUrl}
              controls
              autoPlay
              className="max-h-[75vh] max-w-full rounded-lg"
            />
          ) : (
            <img
              src={asset.mediaUrl}
              alt={asset.alt ?? asset.title ?? ""}
              className="max-h-[75vh] max-w-full rounded-lg object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
