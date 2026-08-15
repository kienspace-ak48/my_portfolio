import type { BlogPostForm, BlogQuery } from "../types/blog";
import adminApi from "./axios";
import publicApi from "./publicApi";

export const getBlogPosts = (params?: BlogQuery) =>
  publicApi.get("/blog", { params });

export const getBlogTags = () => publicApi.get("/blog/tags");

export const getBlogPostBySlug = (slug: string) =>
  publicApi.get(`/blog/slug/${slug}`);

export const getAdminBlogPosts = () => adminApi.get("/blog/admin");

export const getBlogPost = (id: string) => adminApi.get(`/blog/${id}`);

export const createBlogPost = (data: ReturnType<typeof import("../types/blog").toBlogPayload>) =>
  adminApi.post("/blog", data);

export const updateBlogPost = (
  id: string,
  data: ReturnType<typeof import("../types/blog").toBlogPayload>,
) => adminApi.put(`/blog/${id}`, data);

export const deleteBlogPost = (id: string) => adminApi.delete(`/blog/${id}`);

export type { BlogPostForm, BlogQuery };
