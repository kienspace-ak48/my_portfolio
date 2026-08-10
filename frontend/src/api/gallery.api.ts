import { apiFetch, BASE_API } from "./fetchApi";
import type { GalleryAsset, GalleryUpdatePayload } from "../types/gallery";

export const getGalleryAdmin = () =>
  apiFetch<GalleryAsset[]>("/gallery/admin", undefined, { auth: true });

export const getGallery = () => apiFetch<GalleryAsset[]>("/gallery");

export const updateGalleryAsset = (id: string, payload: GalleryUpdatePayload) =>
  apiFetch<GalleryAsset>(`/gallery/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, { auth: true });

export const deleteGalleryAsset = (id: string) =>
  apiFetch<null>(`/gallery/${id}`, { method: "DELETE" }, { auth: true });

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

  const headers = new Headers();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_API}/gallery`, {
    method: "POST",
    headers,
    body: formData,
  });

  const json = (await res.json().catch(() => ({}))) as {
    success: boolean;
    data: GalleryAsset;
    message?: string;
  };

  if (!res.ok) {
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json;
}
