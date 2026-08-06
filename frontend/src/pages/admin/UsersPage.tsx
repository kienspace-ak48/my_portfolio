import useUsers from "../../hooks/useUsers";
import type { User } from "../../types/user";
import { PageLoading } from "../../components/LoadingKit";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN");
}

function RoleBadge({ role }: { role: User["role"] }) {
  const isAdmin = role === "ADMIN";
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{
        background: isAdmin ? "#FFF7E8" : "#F3F4F6",
        color: isAdmin ? "#B45309" : "#475069",
      }}
    >
      {role}
    </span>
  );
}

export default function UsersPage() {
  const { users, loading } = useUsers();

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý User</h1>
          <p className="mt-1 text-sm text-slate-500">
            Model User — name, email, role (ADMIN | USER)
          </p>
        </div>
        <PageLoading
          variant="embedded"
          title="Đang tải người dùng"
          message="Đang lấy danh sách user từ server…"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý User</h1>
        <p className="mt-1 text-sm text-slate-500">
          Model User — name, email, role (ADMIN | USER)
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "#E7E9EE" }}>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-slate-600">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
