import { useMemo, useState } from "react";
import { Link2, Package, Eye, Pencil, Trash2, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

import Badge from "../project/Badge";
import DeleteModal from "../project/DeleteModal";
import type { Project } from "../../types/project";
import { InlineLoading } from "../LoadingKit";

interface ProjectListTableProps {
  projects: Project[];
  isLoading?: boolean;
  pageSize?: number;

  onAdd: () => void;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void | Promise<void>;
}

function formatDate(date: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ProjectListTable({
  projects = [],
  isLoading = false,
  pageSize = 8,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: ProjectListTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return projects;

    return projects.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.slug.toLowerCase().includes(keyword)
    );
  }, [projects, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const pagedProjects = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  async function confirmDelete() {
    if (!pendingDelete) return;

    try {
      setDeletingId(pendingDelete.id);

      await onDelete(pendingDelete);
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">

        {/* Header */}

        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-lg font-semibold">
              Danh sách Project
            </h2>

            <p className="text-sm text-gray-500">
              {filtered.length} dự án
            </p>

          </div>

          <div className="flex items-center gap-2">

            <div className="relative">

              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                value={search}
                placeholder="Tìm theo title hoặc slug..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-60 rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />

            </div>

            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              <Plus size={18} />

              Thêm dự án

            </button>

          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="min-w-full divide-y divide-gray-200 text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-5 py-3 text-left">
                  Dự án
                </th>

                <th className="px-5 py-3 text-left">
                  Trạng thái
                </th>

                <th className="px-5 py-3 text-left">
                  Liên kết
                </th>

                <th className="px-5 py-3 text-left">
                  View
                </th>

                <th className="px-5 py-3 text-left">
                  Hoàn thành
                </th>

                <th className="px-5 py-3 text-right">
                  Hành động
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">
                              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-10">
                    <div className="flex justify-center">
                      <InlineLoading message="Đang tải dữ liệu…" />
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && pagedProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-400"
                  >
                    Không có dữ liệu.
                  </td>
                </tr>
              )}

              {!isLoading &&
                pagedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Project */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        {project.thumbnail ? (

                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="h-12 w-16 rounded-md object-cover border"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />

                        ) : (

                          <div className="flex h-12 w-16 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
                            No Image
                          </div>

                        )}

                        <div>

                          <p className="font-medium text-gray-900">
                            {project.title}
                          </p>

                          <p className="font-mono text-xs text-gray-400">
                            {project.slug}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <div className="flex flex-wrap gap-2">

                        <Badge
                          tone={
                            project.isDisplay
                              ? "green"
                              : "gray"
                          }
                        >
                          {project.isDisplay
                            ? "Đang hiển thị"
                            : "Đã ẩn"}
                        </Badge>

                        {project.featured && (
                          <Badge tone="amber">
                            Nổi bật
                          </Badge>
                        )}

                      </div>

                    </td>

                    {/* Links */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        {project.demoUrl && (

                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 hover:text-indigo-600"
                          >
                            <Link2 size={18} />
                          </a>

                        )}

                        {project.repoUrl && (

                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 hover:text-indigo-600"
                          >
                            <Package size={18} />
                          </a>

                        )}

                        {!project.demoUrl &&
                          !project.repoUrl && "—"}

                      </div>

                    </td>

                    {/* View */}

                    <td className="px-5 py-4">

                      {project.viewCount.toLocaleString("vi-VN")}

                    </td>

                    {/* Finished */}

                    <td className="px-5 py-4">

                      {formatDate(project.finishedAt)}

                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => onView(project)}
                          className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => onEdit(project)}
                          className="rounded-md p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            setPendingDelete(project)
                          }
                          className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>
                {/* Pagination */}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">

            <p className="text-sm text-gray-500">
              Trang <strong>{currentPage}</strong> / {totalPages}
            </p>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Trước
              </button>

              <button
                onClick={() =>
                  setPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
                <ChevronRight size={16} />
              </button>

            </div>

          </div>
        )}

      </div>

      <DeleteModal
        project={pendingDelete}
        deleting={deletingId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}