import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ImageIcon, Save, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GalleryPickerModal from "./gallery/GalleryPickerModal";
import RichTextEditor from "./RichTextEditor";
import TagInput from "./TagInput";
import * as blogApi from "../../api/blog.api";
import {
  BLOG_STATUS_OPTIONS,
  toBlogPayload,
  type BlogPostForm,
} from "../../types/blog";
import { useAdminCategories } from "../../hooks/useTaxonomy";
import {
  adminCardClass,
  adminInputClass,
  adminLabelClass,
  adminSectionDescClass,
  adminSectionTitleClass,
} from "./adminFormStyles";

const EMPTY_FORM: BlogPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverUrl: "",
  category: "tutorial",
  status: "DRAFT",
  isDisplay: false,
  featured: false,
  featuredOrder: 0,
  readMinutes: 5,
  publishedAt: "",
  tags: [],
};

function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${adminCardClass} ${className}`}>
      <div className="border-b border-[#E7E9EE] px-4 py-3 sm:px-5">
        <h2 className={adminSectionTitleClass}>{title}</h2>
        {description ? (
          <p className={`mt-0.5 ${adminSectionDescClass}`}>{description}</p>
        ) : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <span className="relative inline-flex shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="h-5 w-9 rounded-full bg-slate-300 transition-colors peer-checked:bg-amber-600" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogPostForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<BlogPostForm>(EMPTY_FORM);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const { categories, loading: categoriesLoading } = useAdminCategories();

  useEffect(() => {
    blogApi.getBlogTags().then((res) => {
      setTagSuggestions(res.data.data.map((row: { tag: string }) => row.tag));
    });
  }, []);

  useEffect(() => {
    if (id || categories.length === 0) return;
    if (!categories.some((c) => c.slug === form.category)) {
      setForm((prev) => ({ ...prev, category: categories[0].slug }));
    }
  }, [categories, form.category, id]);

  useEffect(() => {
    if (!id) return;
    blogApi.getBlogPost(id).then((res) => {
      const p = res.data.data;
      setForm({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content ?? "",
        coverUrl: p.coverUrl ?? "",
        category: p.category,
        status: p.status ?? "DRAFT",
        isDisplay: p.isDisplay ?? false,
        featured: p.featured ?? false,
        featuredOrder: p.featuredOrder ?? 0,
        readMinutes: p.readMinutes ?? 5,
        publishedAt: p.publishedAt ? p.publishedAt.slice(0, 10) : "",
        tags: p.tags ?? [],
      });
      setSlugTouched(true);
    });
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = toBlogPayload(form);
      if (isEdit && id) {
        await blogApi.updateBlogPost(id, payload);
      } else {
        await blogApi.createBlogPost(payload);
      }
      navigate("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không lưu được bài viết");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-full w-full flex-col">
      <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex flex-wrap items-center gap-3 border-b border-[#E7E9EE] bg-white/95 px-4 py-3 backdrop-blur-sm md:-mx-6 md:px-6">
        <button
          type="button"
          onClick={() => navigate("/admin/blog")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#F3F4F6] hover:text-slate-800"
          aria-label="Quay lại"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-xs text-slate-400">Blog</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-medium text-slate-600">
              {isEdit ? "Chỉnh sửa" : "Thêm mới"}
            </span>
          </div>
          <h1 className="truncate text-base font-bold text-slate-900">
            {form.title || (isEdit ? "Sửa bài viết" : "Thêm bài viết mới")}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/blog"
            className="rounded-lg border border-[#E7E9EE] px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-[#F8F9FB]"
          >
            Hủy
          </Link>
          <button
            type="submit"
            form="blog-form"
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form id="blog-form" onSubmit={handleSubmit} className="w-full">
        <div className="grid w-full gap-4 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col gap-4">
            <Panel title="Thông tin cơ bản" description="Tiêu đề, slug và mô tả ngắn">
              <div className="grid gap-4">
                <div>
                  <label className={adminLabelClass}>
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    className={adminInputClass}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={adminLabelClass}>
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="slug"
                      required
                      value={form.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        handleChange(e);
                      }}
                      className={`${adminInputClass} font-mono text-xs`}
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Danh mục</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      disabled={categoriesLoading || categories.length === 0}
                      className={adminInputClass}
                    >
                      {categories.map((opt) => (
                        <option key={opt.slug} value={opt.slug}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={adminLabelClass}>
                    Mô tả ngắn (excerpt) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="excerpt"
                    required
                    rows={3}
                    value={form.excerpt}
                    onChange={handleChange}
                    className={`${adminInputClass} resize-y`}
                    placeholder="Tóm tắt hiển thị trên card và lead paragraph"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Nội dung bài viết" description="TinyMCE — chèn ảnh từ Gallery">
              <RichTextEditor
                value={form.content}
                onChange={(html) =>
                  setForm((prev) => ({ ...prev, content: html }))
                }
                placeholder="Viết nội dung bài viết..."
                height={420}
                focusTitle={form.title || "Nội dung bài viết"}
              />
            </Panel>

            <Panel title="Tags">
              <TagInput
                value={form.tags}
                onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
                suggestions={tagSuggestions}
              />
            </Panel>
          </div>

          <aside className="flex flex-col gap-4 xl:sticky xl:top-14 xl:self-start">
            <Panel title="Xuất bản">
              <div className="space-y-3">
                <div>
                  <label className={adminLabelClass}>Trạng thái</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={adminInputClass}
                  >
                    {BLOG_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={adminLabelClass}>Ngày xuất bản</label>
                  <input
                    type="date"
                    name="publishedAt"
                    value={form.publishedAt}
                    onChange={handleChange}
                    className={adminInputClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Thời gian đọc (phút)</label>
                  <input
                    type="number"
                    name="readMinutes"
                    min={1}
                    value={form.readMinutes}
                    onChange={handleChange}
                    className={adminInputClass}
                  />
                </div>
                <div className="divide-y divide-[#E7E9EE]">
                  <Toggle
                    label="Hiển thị công khai"
                    checked={form.isDisplay}
                    onChange={(v) => setForm((p) => ({ ...p, isDisplay: v }))}
                  />
                  <Toggle
                    label="Ghim slider trang /blog"
                    checked={form.featured}
                    onChange={(v) =>
                      setForm((p) => ({
                        ...p,
                        featured: v,
                        featuredOrder: v && p.featuredOrder === 0 ? 0 : p.featuredOrder,
                      }))
                    }
                  />
                </div>
                {form.featured ? (
                  <div>
                    <label className={adminLabelClass}>
                      Thứ tự slider (số nhỏ = hiển thị trước)
                    </label>
                    <input
                      type="number"
                      name="featuredOrder"
                      min={0}
                      max={99}
                      value={form.featuredOrder}
                      onChange={handleChange}
                      className={adminInputClass}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Bật ghim trên nhiều bài để tạo carousel trượt ngang ở đầu trang blog.
                    </p>
                  </div>
                ) : null}
              </div>
            </Panel>

            <Panel title="Ảnh cover" description="Chọn từ Gallery">
              {form.coverUrl ? (
                <img
                  src={form.coverUrl}
                  alt="Cover"
                  className="mb-3 aspect-video w-full rounded-lg border border-[#E7E9EE] object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="mb-3 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E7E9EE] bg-[#F8F9FB] text-slate-400 hover:border-amber-400 hover:text-amber-700"
                >
                  <ImageIcon size={28} strokeWidth={1.5} />
                  <span className="text-[11px] font-medium">Chọn ảnh cover</span>
                </button>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                >
                  <ImageIcon size={14} />
                  {form.coverUrl ? "Đổi ảnh" : "Chọn từ Gallery"}
                </button>
                {form.coverUrl ? (
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, coverUrl: "" }))}
                    className="inline-flex items-center justify-center rounded-lg border border-[#E7E9EE] px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : null}
              </div>
            </Panel>
          </aside>
        </div>
      </form>

      <GalleryPickerModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        selectedUrl={form.coverUrl}
        onSelect={(url) => setForm((p) => ({ ...p, coverUrl: url }))}
      />
    </div>
  );
}
