import { useCallback, useEffect, useState } from "react";
import * as storyApi from "../api/stories.api";
import type { Story } from "../types/story";

function useAdminStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await storyApi.getAdminStories();
      setStories(res.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStory = useCallback(
    async (id: string) => {
      await storyApi.deleteStory(id);
      await fetchStories();
    },
    [fetchStories],
  );

  const togglePin = useCallback(
    async (id: string, isPinned: boolean) => {
      setStories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPinned } : s)),
      );
      try {
        await storyApi.updateStoryPin(id, isPinned);
      } catch (err) {
        await fetchStories();
        throw err;
      }
    },
    [fetchStories],
  );

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return { stories, loading, error, fetchStories, deleteStory, togglePin };
}

export default useAdminStories;
