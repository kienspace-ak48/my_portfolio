import api from "./axios";
import { apiFetch } from "./fetchApi";
import type { Story } from "../types/story";

export const getStories = () => apiFetch<Story[]>("/stories");

export const getAdminStories = () =>
  api.get<{ data: Story[] }>("/stories/admin");
export const createStory = (formData: FormData) =>
  api.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteStory = (id: string) => api.delete(`/stories/${id}`);

export const updateStoryPin = (id: string, isPinned: boolean) =>
  api.patch<{ data: Story }>(`/stories/${id}/pin`, { isPinned });
