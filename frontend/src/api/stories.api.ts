import type { Story } from "../types/story";
import adminApi from "./axios";
import publicApi from "./publicApi";

export const getStories = () =>
  publicApi.get<{ success: boolean; data: Story[] }>("/stories").then((res) => res.data);

export const getAdminStories = () =>
  adminApi.get<{ data: Story[] }>("/stories/admin");

export const createStory = (formData: FormData) =>
  adminApi.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteStory = (id: string) => adminApi.delete(`/stories/${id}`);

export const updateStoryPin = (id: string, isPinned: boolean) =>
  adminApi.patch<{ data: Story }>(`/stories/${id}/pin`, { isPinned });
