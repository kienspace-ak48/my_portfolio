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
            const res = await storyApi.getStories();
            console.log(res.data);
            setStories(res.data.data);
        } catch (err) {
            setError(err);
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