import adminApi from "./axios";
import publicApi from "./publicApi";
import type { GalleryAsset, GalleryUpdatePayload } from "../types/gallery";

export async function getGallery() {
  const res = await publicApi.get<{ success: boolean; data: GalleryAsset[] }>("/gallery");
  return { success: res.data.success, data: res.data.data };
}

export async function getGalleryAdmin() {
  const res = await adminApi.get<{ success: boolean; data: GalleryAsset[] }>("/gallery/admin");
  return { success: res.data.success, data: res.data.data };
}

export async function updateGalleryAsset(id: string, payload: GalleryUpdatePayload) {
  const res = await adminApi.put<{ success: boolean; data: GalleryAsset }>(
    `/gallery/${id}`,
    payload,
  );
  return { success: res.data.success, data: res.data.data };
}

export async function deleteGalleryAsset(id: string) {
  const res = await adminApi.delete<{ success: boolean; data: null }>(`/gallery/${id}`);
  return { success: res.data.success, data: res.data.data };
}

export async function uploadGalleryAsset(
  file: File,
  meta?: { title?: string; alt?: string; folder?: string; mediaType?: "IMAGE" | "VIDEO" },
) {
  const formData = new FormData();
  formData.append("media", file);
  if (meta?.title) formData.append("title", meta.title);
  if (meta?.alt) formData.append("alt", meta.alt);
  if (meta?.folder) formData.append("folder", meta.folder);
  if (meta?.mediaType) formData.append("mediaType", meta.mediaType);

  const res = await adminApi.post<{ success: boolean; data: GalleryAsset }>(
    "/gallery",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    },
  );

  return { success: res.data.success, data: res.data.data };
}
