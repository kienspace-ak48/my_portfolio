export interface StoryUser {
  id: number;
  name: string;
  email?: string;
}

export interface Story {
  id: string;
  userId: number;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  mediaType: "IMAGE" | "VIDEO";
  createdAt: string;
  expiresAt: string;
  user: StoryUser;
  _count?: { views: number };
}

export type GalleryItem = {
  id: string;
  source: "project" | "story";
  title: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  createdAt?: string;
};
