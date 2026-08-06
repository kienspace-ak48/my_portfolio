import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as projectApi from "../../api/project.api";
import type { CreateProjectDto } from "../../types/project";
import { toProjectPayload } from "../../types/project";
import RichTextEditor from "./RichTextEditor";

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<CreateProjectDto>({
    title: "",
    slug: "",
    sumary: "",
    desc: "",
    longDesc: "",
    thumbnail: "",
    demoUrl: "",
    repoUrl: "",
    finishedAt: "",
    viewCount: 50,
    isDisplay: true,
    featured: false,
  });

  useEffect(() => {
    if (!id) return;
    projectApi.getProject(Number(id)).then((res) => {
      const p = res.data.data;
      setForm({
        title: p.title,
        slug: p.slug,
        sumary: p.sumary ?? "",
        desc: p.desc ?? "",
        longDesc: p.longDesc ?? "",
        thumbnail: p.thumbnail ?? "",
        demoUrl: p.demoUrl ?? "",
        repoUrl: p.repoUrl ?? "",
        finishedAt: p.finishedAt ? p.finishedAt.slice(0, 10) : "",
        viewCount: p.viewCount,
        isDisplay: p.isDisplay,
        featured: p.featured,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;

    if (name === "title") {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: slugify(value),
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

    const payload = toProjectPayload(form);

    if (isEdit && id) {
      await projectApi.updateProject(Number(id), payload);
    } else {
      await projectApi.createProject(payload);
    }
    navigate("/admin/projects");
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-8 space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold">
            Thông tin dự án
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Điền các trường bên dưới để tạo hoặc cập nhật một Project.
          </p>
        </div>

        {/* TITLE */}
        <div>
          <label className="block mb-2 font-medium">
            Title <span className="text-red-500">*</span>
          </label>

          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="VD: Hệ thống quản lý bán hàng"
            className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* SLUG */}
        <div>
          <label className="block mb-2 font-medium">
            Slug <span className="text-red-500">*</span>
          </label>

          <input
            name="slug"
            required
            value={form.slug}
            onChange={handleChange}
            placeholder="he-thong-quan-ly-ban-hang"
            className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <p className="text-xs text-gray-500 mt-1">
            Tự động sinh từ Title, có thể sửa tay.
          </p>
        </div>

        {/* SUMMARY */}
        <div>
          <label className="block mb-2 font-medium">
            Tóm tắt ngắn
          </label>

          <textarea
            rows={2}
            name="sumary"
            value={form.sumary}
            onChange={handleChange}
            placeholder="Một câu mô tả ngắn hiển thị ở card danh sách"
            className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* DESC */}
        <div>
          <label className="block mb-2 font-medium">
            Mô tả
          </label>

          <textarea
            rows={3}
            name="desc"
            value={form.desc}
            onChange={handleChange}
            placeholder="Mô tả ngắn gọn về dự án"
            className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* LONG DESC */}
        <div>
          <label className="block mb-2 font-medium">
            Mô tả chi tiết
          </label>

          <RichTextEditor
            value={form.longDesc ?? ""}
            onChange={(html) =>
              setForm((prev) => ({ ...prev, longDesc: html }))
            }
            placeholder="Nội dung chi tiết dự án (hỗ trợ định dạng rich text)"
          />
        </div>

        {/* THUMBNAIL */}
        <div>
          <label className="block mb-2 font-medium">
            Thumbnail URL
          </label>

          <input
            type="url"
            name="thumbnail"
            value={form.thumbnail}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
                {/* Demo + Repo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium">
              Demo URL
            </label>

            <input
              type="url"
              name="demoUrl"
              value={form.demoUrl}
              onChange={handleChange}
              placeholder="https://demo.example.com"
              className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Repo URL
            </label>

            <input
              type="url"
              name="repoUrl"
              value={form.repoUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Finished Date + View Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium">
              Ngày hoàn thành
            </label>

            <input
              type="date"
              name="finishedAt"
              value={form.finishedAt}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              View count khởi tạo
            </label>

            <input
              type="number"
              min={0}
              name="viewCount"
              value={form.viewCount}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isDisplay"
              checked={form.isDisplay}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>Hiển thị công khai</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>Nổi bật (Featured)</span>
          </label>
        </div>

        {/* Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-6 py-2.5 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Lưu dự án
          </button>
        </div>
      </form>
    </div>
  );
}