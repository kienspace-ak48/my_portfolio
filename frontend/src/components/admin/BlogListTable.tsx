import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Pin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import DeleteModal from "../project/DeleteModal";
import type { BlogPost } from "../../types/blog";
import { blogCategoryLabel, blogStatusLabel } from "../../types/blog";
import { InlineLoading } from "../LoadingKit";

interface BlogListTableProps {
  posts: BlogPost[];
  isLoading?: boolean;
  pageSize?: number;
  onAdd: () => void;
  onView: (post: BlogPost) => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void | Promise<void>;
}

function formatDate(date: string | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BlogListTable({
  posts = [],
  isLoading = false,
  pageSize = 8,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: BlogListTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return posts;
    return posts.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.slug.toLowerCase().includes(keyword),
    );
  }, [posts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
    <div className="overflow-hidden rounded-xl border border-[#E7E9EE] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E9EE] px-4 py-3 sm:px-5">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm tiêu đề, slug…"
            className="w-full rounded-lg border border-[#E7E9EE] bg-[#FAFBFC] py-2 pr-3 pl-9 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
          />
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          <Plus size={16} />
          Thêm bài viết
        </button>
      </div>

      {isLoading ? (
        <InlineLoading message="Đang tải danh sách bài viết…" />
      ) : paged.length === 0 ? (
        <div className="px-6 py-16 text-center text-sm text-slate-500">
          Chưa có bài viết nào.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E7E9EE] bg-[#FAFBFC] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-5">Bài viết</th>
                <th className="px-4 py-3 font-semibold">Danh mục</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Ngày đăng</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E9EE]">
              {paged.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAFBFC]">
                  <td className="px-4 py-3 sm:px-5">
                    <div className="flex items-start gap-3">
                      {post.coverUrl ? (
                        <img
                          src={post.coverUrl}
                          alt=""
                          className="h-10 w-14 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                          <FileText size={16} />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {post.title}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          /blog/{post.slug}
                          {post.featured ? (
                            <span className="ml-2 inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                              <Pin size={10} />
                              Ghim {post.featuredOrder ?? 0}
                            </span>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {blogCategoryLabel(post)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700"
                          : post.status === "DRAFT"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {post.status ? blogStatusLabel(post.status) : "—"}
                    </span>
                    {!post.isDisplay ? (
                      <span className="ml-1 text-xs text-slate-400">(ẩn)</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(post)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        title="Xem public"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(post)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        title="Sửa"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(post)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-[#E7E9EE] px-4 py-3 text-sm text-slate-600 sm:px-5">
          <span>
            Trang {currentPage}/{totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[#E7E9EE] p-2 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#E7E9EE] p-2 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <DeleteModal
        project={
          pendingDelete
            ? { id: 0, title: pendingDelete.title }
            : null
        }
        deleting={deletingId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
