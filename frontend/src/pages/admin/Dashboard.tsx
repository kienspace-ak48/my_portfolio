import { Link } from "react-router-dom";
import { Boxes, CircleDot, Images, Users } from "lucide-react";
import useProjects from "../../hooks/useProjects";
import useAdminStories from "../../hooks/useAdminStories";
import useUsers from "../../hooks/useUsers";
import { PageLoading } from "../../components/LoadingKit";

function StatCard({
  label,
  value,
  icon: Icon,
  to,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border bg-white p-5 transition hover:border-amber-200 hover:shadow-sm"
      style={{ borderColor: "#E7E9EE" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className="rounded-lg p-2.5"
          style={{ background: "#FFF7E8", color: "#B45309" }}
        >
          <Icon size={20} />
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { projects, loading: loadingProjects } = useProjects();
  const { stories, loading: loadingStories } = useAdminStories();
  const { users, loading: loadingUsers } = useUsers();

  const activeStories = stories.filter(
    (s) => new Date(s.expiresAt) > new Date(),
  ).length;

  const isInitialLoad =
    (loadingProjects || loadingStories || loadingUsers) &&
    projects.length === 0 &&
    users.length === 0;

  if (isInitialLoad) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý portfolio — Projects, Stories, Gallery và Users
          </p>
        </div>
        <PageLoading
          variant="embedded"
          title="Đang tải tổng quan"
          message="Đang thống kê dữ liệu dashboard…"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý portfolio — Projects, Stories, Gallery và Users
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Dự án (Project)"
          value={loadingProjects ? "…" : projects.length}
          icon={Boxes}
          to="/admin/projects"
        />
        <StatCard
          label="Story đang hoạt động"
          value={loadingStories ? "…" : activeStories}
          icon={CircleDot}
          to="/admin/stories"
        />
        <StatCard
          label="Media gallery"
          value={
            loadingProjects || loadingStories
              ? "…"
              : projects.filter((p) => p.thumbnail).length + stories.length
          }
          icon={Images}
          to="/admin/gallery"
        />
        <StatCard
          label="Người dùng"
          value={loadingUsers ? "…" : users.length}
          icon={Users}
          to="/admin/users"
        />
      </div>

      <div className="rounded-xl border bg-white p-5" style={{ borderColor: "#E7E9EE" }}>
        <h2 className="font-semibold text-slate-900">Model backend (Prisma)</h2>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          <li><strong>Project</strong> — slug, title, sumary, desc, thumbnail, featured, viewCount…</li>
          <li><strong>Story</strong> — mediaUrl, mediaType (IMAGE|VIDEO), expiresAt 24h, userId</li>
          <li><strong>User</strong> — name, email, role (ADMIN|USER)</li>
          <li><strong>Gallery</strong> — tổng hợp thumbnail Project + media Story</li>
        </ul>
      </div>
    </div>
  );
}
