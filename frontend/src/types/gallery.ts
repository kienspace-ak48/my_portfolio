export type GalleryMediaType = "IMAGE" | "VIDEO";

export interface GalleryAsset {
  id: string;
  title: string | null;
  alt: string | null;
  mediaUrl: string;
  thumbnailUrl: string | null;
  publicId: string | null;
  mediaType: GalleryMediaType;
  folder: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
}

export type GalleryUpdatePayload = {
  title?: string | null;
  alt?: string | null;
  folder?: string | null;
};

export type GalleryFilter = "ALL" | GalleryMediaType;
