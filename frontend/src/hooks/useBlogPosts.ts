import { useCallback, useEffect, useState } from "react";
import * as blogApi from "../api/blog.api";
import type { BlogPost, BlogQuery } from "../types/blog";

function buildBlogQuery(params?: BlogQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.tag) sp.set("tag", params.tag);
  if (params.sort) sp.set("sort", params.sort);
  if (params.featured) sp.set("featured", params.featured);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function useBlogPosts(query?: BlogQuery) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogApi.getBlogPosts(query);
      const data = res.data?.data;
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được bài viết");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [query?.q, query?.category, query?.tag, query?.sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

export function useAdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogApi.getAdminBlogPosts();
      const data = res.data?.data;
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được bài viết");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const removePost = useCallback(
    async (id: string) => {
      await blogApi.deleteBlogPost(id);
      await fetchPosts();
    },
    [fetchPosts],
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, fetchPosts, deletePost: removePost };
}

export function useBlogPostBySlug(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await blogApi.getBlogPostBySlug(slug);
        if (!cancelled) setPost(res.data?.data ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Không tải được bài viết");
          setPost(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading, error };
}
