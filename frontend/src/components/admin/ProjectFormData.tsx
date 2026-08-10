import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  Save,
  Trash2,
} from "lucide-react";
import GalleryPickerModal from "./gallery/GalleryPickerModal";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as projectApi from "../../api/project.api";
import type { CreateProjectDto } from "../../types/project";
import { PROJECT_STATUS_OPTIONS, toProjectPayload } from "../../types/project";
import {
  adminCardClass,
  adminInputClass,
  adminLabelClass,
  adminSectionDescClass,
  adminSectionTitleClass,
} from "./adminFormStyles";
import FeatureListInput from "./FeatureListInput";
import RichTextEditor from "./RichTextEditor";
import TagInput from "./TagInput";

const EMPTY_FORM: CreateProjectDto = {
  title: "",
  slug: "",
  badge: "",
  sumary: "",
  desc: "",
  longDesc: "",
  thumbnail: "",
  status: "IN_PROGRESS",
  demoUrl: "",
  repoUrl: "",
  finishedAt: "",
  viewCount: 0,
  isDisplay: true,
  featured: false,
  tags: [],
  features: [],
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

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<CreateProjectDto>(EMPTY_FORM);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    projectApi.getProjectTags().then((res) => {
      setTagSuggestions(res.data.data.map((row: { tag: string }) => row.tag));
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    projectApi.getProject(Number(id)).then((res) => {
      const p = res.data.data;
      setForm({
        title: p.title,
        slug: p.slug,
        badge: p.badge ?? "",
        sumary: p.sumary ?? "",
        desc: p.desc ?? "",
        longDesc: p.longDesc ?? "",
        thumbnail: p.thumbnail ?? "",
        status: p.status,
        demoUrl: p.demoUrl ?? "",
        repoUrl: p.repoUrl ?? "",
        finishedAt: p.finishedAt ? p.finishedAt.slice(0, 10) : "",
        viewCount: p.viewCount,
        isDisplay: p.isDisplay,
        featured: p.featured,
        tags: p.tags ?? [],
        features: p.features?.length ? p.features : [],
      });
    });
  }, [id]);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;

    if (name === "title") {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: isEdit ? prev.slug : slugify(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = toProjectPayload(form);
      if (isEdit && id) {
        await projectApi.updateProject(Number(id), payload);
      } else {
        await projectApi.createProject(payload);
      }
      navigate("/admin/projects");
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String(err.response.data.message)
          : "Không thể lưu dự án";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-full w-full flex-col">
      {/* Top bar — full width, actions bên phải */}
      <div className="-mx-4 -mt-4 mb-5 flex flex-wrap items-center gap-3 border-b border-[#E7E9EE] bg-white px-4 py-3 md:-mx-6 md:px-6">
        <button
          type="button"
          onClick={() => navigate("/admin/projects")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#F3F4F6] hover:text-slate-800"
          aria-label="Quay lại"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-xs text-slate-400">Projects</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-medium text-slate-600">
              {isEdit ? "Chỉnh sửa" : "Thêm mới"}
            </span>
          </div>
          <h1 className="truncate text-base font-bold text-slate-900">
            {form.title || (isEdit ? "Chỉnh sửa dự án" : "Tạo dự án mới")}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {form.slug ? (
            <Link
              to={`/projects/${form.slug}`}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg border border-[#E7E9EE] px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-[#F8F9FB] sm:inline-flex"
            >
              <ExternalLink size={14} />
              Preview
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="rounded-lg border border-[#E7E9EE] px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-[#F8F9FB]"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="project-form"
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

      <form id="project-form" onSubmit={handleSubmit} className="w-full">
        <div className="grid w-full gap-4 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main — chiếm hết phần còn lại */}
          <div className="flex min-w-0 flex-col gap-4">
            <Panel title="Thông tin cơ bản" description="Hiển thị trên card catalog">
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
                    placeholder="Personal Portfolio"
                    className={adminInputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <label className={adminLabelClass}>
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="slug"
                      required
                      value={form.slug}
                      onChange={handleChange}
                      className={`${adminInputClass} font-mono text-xs`}
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Badge</label>
                    <input
                      name="badge"
                      value={form.badge}
                      onChange={handleChange}
                      placeholder="Full-stack"
                      className={adminInputClass}
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className={adminLabelClass}>Trạng thái</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={adminInputClass}
                    >
                      {PROJECT_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={adminLabelClass}>Tóm tắt</label>
                    <textarea
                      rows={3}
                      name="sumary"
                      value={form.sumary}
                      onChange={handleChange}
                      className={`${adminInputClass} resize-y`}
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Mô tả card</label>
                    <textarea
                      rows={3}
                      name="desc"
                      value={form.desc}
                      onChange={handleChange}
                      className={`${adminInputClass} resize-y`}
                    />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Nội dung chi tiết" description="Rich text — case study / kỹ thuật">
              <RichTextEditor
                value={form.longDesc}
                onChange={(html) =>
                  setForm((prev) => ({ ...prev, longDesc: html }))
                }
                placeholder="Viết mô tả chi tiết..."
                height={380}
                focusTitle={form.title || "Nội dung chi tiết dự án"}
              />
            </Panel>

            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="Tags" description="Công nghệ lọc trên catalog">
                <TagInput
                  value={form.tags}
                  onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
                  suggestions={tagSuggestions}
                />
              </Panel>
              <Panel title="Tính năng" description="Bullet trên trang chi tiết">
                <FeatureListInput
                  value={form.features}
                  onChange={(features) =>
                    setForm((prev) => ({ ...prev, features }))
                  }
                />
              </Panel>
            </div>
          </div>

          {/* Sidebar — cố định width, sticky */}
          <aside className="flex flex-col gap-4 xl:sticky xl:top-0 xl:self-start">
            <Panel title="Xuất bản">
              <div className="divide-y divide-[#E7E9EE]">
                <Toggle
                  label="Hiển thị công khai"
                  checked={form.isDisplay}
                  onChange={(v) => setForm((p) => ({ ...p, isDisplay: v }))}
                />
                <Toggle
                  label="Dự án nổi bật"
                  checked={form.featured}
                  onChange={(v) => setForm((p) => ({ ...p, featured: v }))}
                />
              </div>
            </Panel>

            <Panel title="Thumbnail" description="Chọn ảnh từ thư viện Gallery">
              {form.thumbnail ? (
                <img
                  src={form.thumbnail}
                  alt="Thumbnail dự án"
                  className="mb-3 aspect-video w-full rounded-lg border border-[#E7E9EE] object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="mb-3 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E7E9EE] bg-[#F8F9FB] text-slate-400 transition hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-700"
                >
                  <ImageIcon size={28} strokeWidth={1.5} />
                  <span className="text-[11px] font-medium">Chưa có ảnh — bấm chọn</span>
                </button>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
                >
                  <ImageIcon size={14} />
                  {form.thumbnail ? "Đổi ảnh" : "Chọn từ Gallery"}
                </button>
                {form.thumbnail ? (
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, thumbnail: "" }))}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#E7E9EE] px-3 py-2 text-xs font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50"
                    title="Xóa thumbnail"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : null}
              </div>

              {form.thumbnail ? (
                <p className="mt-2 truncate text-[10px] text-slate-400" title={form.thumbnail}>
                  {form.thumbnail}
                </p>
              ) : null}
            </Panel>

            <Panel title="Liên kết">
              <div className="space-y-3">
                <div>
                  <label className={adminLabelClass}>Demo</label>
                  <input
                    type="url"
                    name="demoUrl"
                    value={form.demoUrl}
                    onChange={handleChange}
                    className={adminInputClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass}>Repository</label>
                  <input
                    type="url"
                    name="repoUrl"
                    value={form.repoUrl}
                    onChange={handleChange}
                    className={adminInputClass}
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Meta">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={adminLabelClass}>Ngày hoàn thành</label>
                  <input
                    type="date"
                    name="finishedAt"
                    value={form.finishedAt}
                    onChange={handleChange}
                    className={adminInputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className={adminLabelClass}>Lượt xem</label>
                  <input
                    type="number"
                    min={0}
                    name="viewCount"
                    value={form.viewCount}
                    onChange={handleChange}
                    className={adminInputClass}
                  />
                </div>
              </div>
            </Panel>
          </aside>
        </div>
      </form>

      <GalleryPickerModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        selectedUrl={form.thumbnail}
        onSelect={(url) => setForm((p) => ({ ...p, thumbnail: url }))}
      />
    </div>
  );
}
