import { useState, useEffect } from "react";
import * as storyApi from "../api/stories.api";
import type { Story } from "../types/story";

function useStories() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    async function fetchStories() {
        try {
            setLoading(true);
            setError(null);
            const res = await storyApi.getStories();
            setStories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(err);
            setStories([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStories();
    }, []);

    return {
        stories,
        loading,
        error,
        fetchStories,
    };
}

export default useStories;