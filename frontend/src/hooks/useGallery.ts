import { useCallback, useEffect, useState } from "react";
import * as galleryApi from "../api/gallery.api";
import type { GalleryAsset, GalleryUpdatePayload } from "../types/gallery";

export default function useGallery() {
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await galleryApi.getGalleryAdmin();
      setAssets(res.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const uploadAsset = useCallback(
    async (
      file: File,
      meta?: Parameters<typeof galleryApi.uploadGalleryAsset>[1],
    ) => {
      setUploading(true);
      try {
        const res = await galleryApi.uploadGalleryAsset(file, meta);
        setAssets((prev) => [res.data, ...prev]);
        return res.data;
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  const updateAsset = useCallback(
    async (id: string, payload: GalleryUpdatePayload) => {
      const res = await galleryApi.updateGalleryAsset(id, payload);
      setAssets((prev) =>
        prev.map((a) => (a.id === id ? res.data : a)),
      );
      return res.data;
    },
    [],
  );

  const deleteAsset = useCallback(async (id: string) => {
    await galleryApi.deleteGalleryAsset(id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    assets,
    loading,
    error,
    uploading,
    fetchGallery,
    uploadAsset,
    updateAsset,
    deleteAsset,
  };
}
