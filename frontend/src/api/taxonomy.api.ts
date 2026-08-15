import publicApi from "./publicApi";
import adminApi from "./axios";
import type { AdminTag, BlogCategoryDef, CategoryForm, TagForm } from "../types/taxonomy";

export async function listPublicCategories() {
  const res = await publicApi.get<{ success: boolean; data: BlogCategoryDef[] }>(
    "/blog/categories",
  );
  return { success: res.data.success, data: res.data.data };
}

export async function listAdminCategories() {
  const res = await adminApi.get<{ success: boolean; data: BlogCategoryDef[] }>(
    "/admin/blog/categories",
  );
  return { success: res.data.success, data: res.data.data };
}

export async function listAdminTags() {
  const res = await adminApi.get<{ success: boolean; data: AdminTag[] }>("/admin/tags");
  return { success: res.data.success, data: res.data.data };
}

export async function createTag(body: TagForm) {
  const res = await adminApi.post<{ success: boolean; data: AdminTag }>("/admin/tags", body);
  return { success: res.data.success, data: res.data.data };
}

export async function updateTag(id: number, body: TagForm) {
  const res = await adminApi.put<{ success: boolean; data: AdminTag }>(`/admin/tags/${id}`, body);
  return { success: res.data.success, data: res.data.data };
}

export async function deleteTag(id: number) {
  const res = await adminApi.delete<{ success: boolean; data: null }>(`/admin/tags/${id}`);
  return { success: res.data.success, data: res.data.data };
}

export async function createCategory(body: CategoryForm) {
  const res = await adminApi.post<{ success: boolean; data: BlogCategoryDef }>(
    "/admin/blog/categories",
    body,
  );
  return { success: res.data.success, data: res.data.data };
}

export async function updateCategory(id: number, body: Partial<CategoryForm>) {
  const res = await adminApi.put<{ success: boolean; data: BlogCategoryDef }>(
    `/admin/blog/categories/${id}`,
    body,
  );
  return { success: res.data.success, data: res.data.data };
}

export async function deleteCategory(id: number) {
  const res = await adminApi.delete<{ success: boolean; data: null }>(
    `/admin/blog/categories/${id}`,
  );
  return { success: res.data.success, data: res.data.data };
}
