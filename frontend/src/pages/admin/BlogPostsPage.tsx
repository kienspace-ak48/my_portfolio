import { useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import BlogListTable from "../../components/admin/BlogListTable";
import { PageLoading } from "../../components/LoadingKit";
import { useAdminBlogPosts } from "../../hooks/useBlogPosts";
import { seedBlogDemo } from "../../api/backup.api";
import type { BlogPost } from "../../types/blog";
import { useState } from "react";

export default function BlogPostsPage() {
  const navigate = useNavigate();
  const { posts, loading, error, fetchPosts, deletePost } = useAdminBlogPosts();
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  async function handleSeedDemo() {
    try {
      setSeeding(true);
      setSeedMsg(null);
      const res = await seedBlogDemo();
      setSeedMsg(`Đã seed ${res.data.data.count} bài demo.`);
      await fetchPosts();
    } catch (err) {
      setSeedMsg(err instanceof Error ? err.message : "Seed thất bại");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Blog</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tạo, sửa và xuất bản bài viết hiển thị trên /blog
          </p>
        </div>
        <button
          type="button"
          onClick={handleSeedDemo}
          disabled={seeding}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
        >
          <Sprout size={16} />
          {seeding ? "Đang seed…" : "Seed demo (11 bài)"}
        </button>
      </div>

      {seedMsg ? (
        <p className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">
          {seedMsg}
        </p>
      ) : null}

      {loading ? (
        <PageLoading
          variant="embedded"
          title="Đang tải blog"
          message="Đang lấy danh sách bài viết…"
        />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
          <p className="font-medium text-red-800">{error}</p>
          <button
            type="button"
            onClick={() => fetchPosts()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      ) : (
        <BlogListTable
          posts={posts}
          isLoading={false}
          onAdd={() => navigate("/admin/blog/new")}
          onView={(p: BlogPost) => window.open(`/blog/${p.slug}`, "_blank")}
          onEdit={(p) => navigate(`/admin/blog/edit/${p.id}`)}
          onDelete={async (p) => {
            await deletePost(p.id);
          }}
        />
      )}
    </div>
  );
}
