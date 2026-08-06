import { useMemo, useRef, useState } from "react";
import { Film, Image, Plus, Trash2 } from "lucide-react";
import useAdminStories from "../../hooks/useAdminStories";
import useUsers from "../../hooks/useUsers";
import * as storyApi from "../../api/stories.api";
import type { Story } from "../../types/story";
import { InlineLoading, PageLoading } from "../../components/LoadingKit";

function formatDate(date: string) {
  return new Date(date).toLocaleString("vi-VN");
}

function isExpired(expiresAt: string) {
  return new Date(expiresAt) <= new Date();
}

export default function StoriesPage() {
  const { stories, loading, deleteStory, fetchStories } = useAdminStories();
  const { users } = useUsers();
  const fileRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState("");
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [uploading, setUploading] = useState(false);

  const adminUsers = useMemo(
    () => users.filter((u) => u.role === "ADMIN" || u.role === "USER"),
    [users],
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append("media", file);
    formData.append("userId", userId);
    formData.append("mediaType", mediaType);

    try {
      setUploading(true);
      await storyApi.createStory(formData);
      await fetchStories();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Story</h1>
          <p className="mt-1 text-sm text-slate-500">
            Model Story — mediaUrl, mediaType, expiresAt (24h), userId
          </p>
        </div>
        <PageLoading
          variant="embedded"
          title="Đang tải stories"
          message="Đang lấy danh sách story từ server…"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Story</h1>
        <p className="mt-1 text-sm text-slate-500">
          Model Story — mediaUrl, mediaType, expiresAt (24h), userId
        </p>
      </div>

      <div
        className="flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4"
        style={{ borderColor: "#E7E9EE" }}
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "#E7E9EE" }}
          >
            <option value="">Chọn user</option>
            {adminUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Loại media</label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as "IMAGE" | "VIDEO")}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "#E7E9EE" }}
          >
            <option value="IMAGE">IMAGE</option>
            <option value="VIDEO">VIDEO</option>
          </select>
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
        <button
          type="button"
          disabled={!userId || uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "#B45309" }}
        >
          <Plus size={16} />
          {uploading ? "Đang tải lên…" : "Thêm story"}
        </button>
        {uploading && (
          <InlineLoading message="Đang tải media lên server…" />
        )}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "#E7E9EE" }}>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Lượt xem</th>
              <th className="px-4 py-3">Tạo lúc</th>
              <th className="px-4 py-3">Hết hạn</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {stories.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Chưa có story</td>
              </tr>
            )}
            {stories.map((story: Story) => (
                <tr key={story.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <img
                      src={story.thumbnailUrl ?? story.mediaUrl}
                      alt=""
                      className="h-14 w-20 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{story.user?.name ?? story.userId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      {story.mediaType === "VIDEO" ? <Film size={14} /> : <Image size={14} />}
                      {story.mediaType}
                    </span>
                  </td>
                  <td className="px-4 py-3">{story._count?.views ?? 0}</td>
                  <td className="px-4 py-3">{formatDate(story.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={isExpired(story.expiresAt) ? "text-red-600" : "text-emerald-600"}>
                      {formatDate(story.expiresAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => deleteStory(story.id)}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
