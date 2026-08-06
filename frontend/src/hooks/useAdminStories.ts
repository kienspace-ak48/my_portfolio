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

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return { stories, loading, error, fetchStories, deleteStory };
}

export default useAdminStories;
