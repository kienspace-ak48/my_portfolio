import { useMemo, useState, type FormEvent } from "react";
import { FolderTree, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import DeleteModal from "../../components/project/DeleteModal";
import { PageLoading } from "../../components/LoadingKit";
import * as taxonomyApi from "../../api/taxonomy.api";
import { useAdminCategories, useAdminTags } from "../../hooks/useTaxonomy";
import type { AdminTag, BlogCategoryDef, CategoryForm, TagForm } from "../../types/taxonomy";
import {
  adminInputClass,
  adminLabelClass,
} from "../../components/admin/adminFormStyles";

type Tab = "tags" | "categories";

const EMPTY_TAG: TagForm = { name: "" };

const EMPTY_CATEGORY: CategoryForm = {
  label: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#E7E9EE] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E7E9EE] px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function AdminTaxonomyPage() {
  const [tab, setTab] = useState<Tab>("tags");
  const { tags, loading: tagsLoading, error: tagsError, fetchTags } = useAdminTags();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    fetchCategories,
  } = useAdminCategories();

  const [tagModal, setTagModal] = useState<"create" | AdminTag | null>(null);
  const [tagForm, setTagForm] = useState<TagForm>(EMPTY_TAG);
  const [tagSaving, setTagSaving] = useState(false);
  const [tagFormError, setTagFormError] = useState<string | null>(null);
  const [pendingDeleteTag, setPendingDeleteTag] = useState<AdminTag | null>(null);
  const [deletingTag, setDeletingTag] = useState(false);

  const [categoryModal, setCategoryModal] = useState<"create" | BlogCategoryDef | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(EMPTY_CATEGORY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [pendingDeleteCategory, setPendingDeleteCategory] = useState<BlogCategoryDef | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  const loading = tab === "tags" ? tagsLoading : categoriesLoading;
  const listError = tab === "tags" ? tagsError : categoriesError;

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label)),
    [categories],
  );

  function openCreateTag() {
    setTagForm(EMPTY_TAG);
    setTagFormError(null);
    setTagModal("create");
  }

  function openEditTag(tag: AdminTag) {
    setTagForm({ name: tag.name });
    setTagFormError(null);
    setTagModal(tag);
  }

  function openCreateCategory() {
    setCategoryForm(EMPTY_CATEGORY);
    setSlugTouched(false);
    setCategoryFormError(null);
    setCategoryModal("create");
  }

  function openEditCategory(cat: BlogCategoryDef) {
    setCategoryForm({
      label: cat.label,
      slug: cat.slug,
      description: cat.description ?? "",
      sortOrder: cat.sortOrder,
      isActive: cat.isActive !== false,
    });
    setSlugTouched(true);
    setCategoryFormError(null);
    setCategoryModal(cat);
  }

  async function submitTag(e: FormEvent) {
    e.preventDefault();
    setTagSaving(true);
    setTagFormError(null);
    try {
      if (tagModal === "create") {
        await taxonomyApi.createTag(tagForm);
      } else if (tagModal && typeof tagModal === "object") {
        await taxonomyApi.updateTag(tagModal.id, tagForm);
      }
      setTagModal(null);
      await fetchTags();
    } catch (err) {
      setTagFormError(err instanceof Error ? err.message : "Không lưu được tag");
    } finally {
      setTagSaving(false);
    }
  }

  async function confirmDeleteTag() {
    if (!pendingDeleteTag) return;
    try {
      setDeletingTag(true);
      await taxonomyApi.deleteTag(pendingDeleteTag.id);
      setPendingDeleteTag(null);
      await fetchTags();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không xóa được tag");
    } finally {
      setDeletingTag(false);
    }
  }

  async function submitCategory(e: FormEvent) {
    e.preventDefault();
    setCategorySaving(true);
    setCategoryFormError(null);
    try {
      if (categoryModal === "create") {
        await taxonomyApi.createCategory(categoryForm);
      } else if (categoryModal && typeof categoryModal === "object") {
        await taxonomyApi.updateCategory(categoryModal.id, categoryForm);
      }
      setCategoryModal(null);
      await fetchCategories();
    } catch (err) {
      setCategoryFormError(err instanceof Error ? err.message : "Không lưu được danh mục");
    } finally {
      setCategorySaving(false);
    }
  }

  async function confirmDeleteCategory() {
    if (!pendingDeleteCategory) return;
    try {
      setDeletingCategory(true);
      await taxonomyApi.deleteCategory(pendingDeleteCategory.id);
      setPendingDeleteCategory(null);
      await fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không xóa được danh mục");
    } finally {
      setDeletingCategory(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tags & Danh mục</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý tag dùng chung cho Project/Blog và danh mục bài viết blog
        </p>
      </div>

      <div className="inline-flex rounded-lg border border-[#E7E9EE] bg-white p-1">
        <button
          type="button"
          onClick={() => setTab("tags")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            tab === "tags" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Tag size={15} />
          Tags
        </button>
        <button
          type="button"
          onClick={() => setTab("categories")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            tab === "categories" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <FolderTree size={15} />
          Danh mục blog
        </button>
      </div>

      {listError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {listError}
        </p>
      ) : null}

      {loading ? (
        <PageLoading
          variant="embedded"
          title={tab === "tags" ? "Đang tải tags" : "Đang tải danh mục"}
          message="Đang lấy dữ liệu từ server…"
        />
      ) : tab === "tags" ? (
        <div className="overflow-hidden rounded-xl border border-[#E7E9EE] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7E9EE] px-4 py-3 sm:px-5">
            <p className="text-sm text-slate-500">{tags.length} tag</p>
            <button
              type="button"
              onClick={openCreateTag}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              <Plus size={16} />
              Thêm tag
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#E7E9EE] bg-[#FAFBFC] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold sm:px-5">Tên</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Projects</th>
                  <th className="px-4 py-3 font-semibold">Blog</th>
                  <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9EE]">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-[#FAFBFC]">
                    <td className="px-4 py-3 font-medium text-slate-900 sm:px-5">{tag.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{tag.slug}</td>
                    <td className="px-4 py-3 text-slate-600">{tag.projectCount}</td>
                    <td className="px-4 py-3 text-slate-600">{tag.blogPostCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEditTag(tag)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          title="Sửa"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteTag(tag)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          title="Xóa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tags.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-slate-500">Chưa có tag nào.</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E7E9EE] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7E9EE] px-4 py-3 sm:px-5">
            <p className="text-sm text-slate-500">{sortedCategories.length} danh mục</p>
            <button
              type="button"
              onClick={openCreateCategory}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              <Plus size={16} />
              Thêm danh mục
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#E7E9EE] bg-[#FAFBFC] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold sm:px-5">Nhãn</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Bài viết</th>
                  <th className="px-4 py-3 font-semibold">Thứ tự</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9EE]">
                {sortedCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FAFBFC]">
                    <td className="px-4 py-3 font-medium text-slate-900 sm:px-5">{cat.label}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-slate-600">{cat.postCount ?? 0}</td>
                    <td className="px-4 py-3 text-slate-600">{cat.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          cat.isActive !== false
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {cat.isActive !== false ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCategory(cat)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          title="Sửa"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteCategory(cat)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          title="Xóa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedCategories.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-slate-500">Chưa có danh mục nào.</p>
            ) : null}
          </div>
        </div>
      )}

      {tagModal ? (
        <Modal
          title={tagModal === "create" ? "Thêm tag" : "Sửa tag"}
          onClose={() => setTagModal(null)}
        >
          <form onSubmit={submitTag} className="space-y-4">
            {tagFormError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {tagFormError}
              </p>
            ) : null}
            <div>
              <label className={adminLabelClass}>Tên tag</label>
              <input
                required
                value={tagForm.name}
                onChange={(e) => setTagForm({ name: e.target.value })}
                className={adminInputClass}
                placeholder="VD: React, Node.js"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTagModal(null)}
                className="rounded-lg border border-[#E7E9EE] px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={tagSaving}
                className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
              >
                {tagSaving ? "Đang lưu…" : "Lưu"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {categoryModal ? (
        <Modal
          title={categoryModal === "create" ? "Thêm danh mục" : "Sửa danh mục"}
          onClose={() => setCategoryModal(null)}
        >
          <form onSubmit={submitCategory} className="space-y-4">
            {categoryFormError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {categoryFormError}
              </p>
            ) : null}
            <div>
              <label className={adminLabelClass}>Nhãn hiển thị</label>
              <input
                required
                value={categoryForm.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setCategoryForm((prev) => ({
                    ...prev,
                    label,
                    slug: slugTouched ? prev.slug : slugify(label),
                  }));
                }}
                className={adminInputClass}
                placeholder="VD: Backend"
              />
            </div>
            <div>
              <label className={adminLabelClass}>Slug</label>
              <input
                required
                value={categoryForm.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setCategoryForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
                className={`${adminInputClass} font-mono text-xs`}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Mô tả (tuỳ chọn)</label>
              <textarea
                rows={2}
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className={`${adminInputClass} resize-y`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={adminLabelClass}>Thứ tự</label>
                <input
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      sortOrder: Number(e.target.value) || 0,
                    }))
                  }
                  className={adminInputClass}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  Hiển thị trên blog
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCategoryModal(null)}
                className="rounded-lg border border-[#E7E9EE] px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={categorySaving}
                className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
              >
                {categorySaving ? "Đang lưu…" : "Lưu"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      <DeleteModal
        project={
          pendingDeleteTag ? { id: pendingDeleteTag.id, title: pendingDeleteTag.name } : null
        }
        deleting={deletingTag}
        onCancel={() => setPendingDeleteTag(null)}
        onConfirm={confirmDeleteTag}
      />

      <DeleteModal
        project={
          pendingDeleteCategory
            ? { id: pendingDeleteCategory.id, title: pendingDeleteCategory.label }
            : null
        }
        deleting={deletingCategory}
        onCancel={() => setPendingDeleteCategory(null)}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
}
