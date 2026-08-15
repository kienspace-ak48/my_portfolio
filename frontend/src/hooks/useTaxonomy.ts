import { useCallback, useEffect, useState } from "react";
import * as taxonomyApi from "../api/taxonomy.api";
import type { AdminTag, BlogCategoryDef } from "../types/taxonomy";

export function useAdminTags() {
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taxonomyApi.listAdminTags();
      setTags(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được tags");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTags();
  }, [fetchTags]);

  return { tags, loading, error, fetchTags };
}

export function useAdminCategories() {
  const [categories, setCategories] = useState<BlogCategoryDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await taxonomyApi.listAdminCategories();
      setCategories(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, fetchCategories };
}

export function useBlogCategories() {
  const [categories, setCategories] = useState<BlogCategoryDef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taxonomyApi
      .listPublicCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
