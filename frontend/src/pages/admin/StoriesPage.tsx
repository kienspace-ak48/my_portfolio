import { useMemo, useRef, useState } from "react";
import {
  Clock,
  Eye,
  Film,
  Image as ImageIcon,
  Loader2,
  Pin,
  PinOff,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import useAdminStories from "../../hooks/useAdminStories";
import useUsers from "../../hooks/useUsers";
import * as storyApi from "../../api/stories.api";
import type { Story } from "../../types/story";
import { PageLoading } from "../../components/LoadingKit";
import GalleryPickerModal from "../../components/admin/gallery/GalleryPickerModal";
import {
  adminCardClass,
  adminInputClass,
  adminLabelClass,
  adminSectionDescClass,
  adminSectionTitleClass,
} from "../../components/admin/adminFormStyles";
import { getStoryPreview } from "../../utils/storyGroups";

function formatDate(date: string) {
  return new Date(date).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isExpired(expiresAt: string) {
  return new Date(expiresAt) <= new Date();
}

function StoryStatusBadge({ story }: { story: Story }) {
  if (story.isPinned) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
        <Pin size={10} />
        Ghim
      </span>
    );
  }
  if (isExpired(story.expiresAt)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
        Hết hạn
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
      <Clock size={10} />
      Còn hạn
    </span>
  );
}

function StoryCard({
  story,
  onTogglePin,
  onDelete,
  pinning,
}: {
  story: Story;
  onTogglePin: (id: string, pinned: boolean) => void;
  onDelete: (id: string) => void;
  pinning: string | null;
}) {
  const preview = getStoryPreview(story);
  const busy = pinning === story.id;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E7E9EE] bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-9/16 overflow-hidden bg-slate-100">
        <img
          src={preview}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/20" />

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <StoryStatusBadge story={story} />
          {story.mediaType === "VIDEO" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              <Film size={10} />
              Video
            </span>
          )}
        </div>

        <div className="absolute right-2 top-2 flex gap-1">
          <button
            type="button"
            disabled={busy}
            onClick={() => onTogglePin(story.id, !story.isPinned)}
            title={story.isPinned ? "Bỏ ghim" : "Ghim story"}
            className={`rounded-full p-2 shadow-sm backdrop-blur-sm transition disabled:opacity-60 ${
              story.isPinned
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-white/95 text-slate-700 hover:bg-white"
            }`}
          >
            {busy ? (
              <Loader2 size={14} className="animate-spin" />
            ) : story.isPinned ? (
              <PinOff size={14} />
            ) : (
              <Pin size={14} />
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(story.id)}
            title="Xóa story"
            className="rounded-full bg-white/95 p-2 text-red-600 shadow-sm backdrop-blur-sm transition hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold backdrop-blur-sm">
              {(story.user?.name ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{story.user?.name ?? `User #${story.userId}`}</p>
              <p className="truncate text-[11px] text-white/75">{formatDate(story.createdAt)}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-white/80">
            <span className="inline-flex items-center gap-1">
              <Eye size={12} />
              {story._count?.views ?? 0} lượt xem
            </span>
            <span>
              {story.isPinned ? "Hiển thị vĩnh viễn" : `Hết hạn ${formatDate(story.expiresAt)}`}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function StoriesPage() {
  const { stories, loading, deleteStory, togglePin, fetchStories } = useAdminStories();
  const { users } = useUsers();
  const fileRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState("");
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [isPinned, setIsPinned] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryUrl, setGalleryUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pinningId, setPinningId] = useState<string | null>(null);

  const adminUsers = useMemo(
    () => users.filter((u) => u.role === "ADMIN" || u.role === "USER"),
    [users],
  );

  const stats = useMemo(() => {
    const pinned = stories.filter((s) => s.isPinned).length;
    const active = stories.filter((s) => !s.isPinned && !isExpired(s.expiresAt)).length;
    const expired = stories.filter((s) => !s.isPinned && isExpired(s.expiresAt)).length;
    return { total: stories.length, pinned, active, expired };
  }, [stories]);

  function resetForm() {
    setGalleryUrl("");
    setIsPinned(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submitStory(payload: FormData) {
    if (!userId) return;

    payload.append("userId", userId);
    payload.append("mediaType", mediaType);
    payload.append("isPinned", String(isPinned));

    try {
      setUploading(true);
      await storyApi.createStory(payload);
      await fetchStories();
      resetForm();
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryCreate() {
    if (!userId || !galleryUrl) return;
    const formData = new FormData();
    formData.append("mediaUrl", galleryUrl);
    await submitStory(formData);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    const formData = new FormData();
    formData.append("media", file);
    await submitStory(formData);
  }

  async function handleTogglePin(id: string, pinned: boolean) {
    try {
      setPinningId(id);
      await togglePin(id, pinned);
    } finally {
      setPinningId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stories</h1>
          <p className={`mt-1 ${adminSectionDescClass}`}>Quản lý story hiển thị trên trang chủ</p>
        </div>
        <PageLoading variant="embedded" title="Đang tải stories" message="Đang lấy danh sách từ server…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stories</h1>
          <p className={`mt-1 max-w-xl ${adminSectionDescClass}`}>
            Tạo story từ Gallery hoặc upload. Ghim để hiển thị mãi — bấm icon ghim trên preview để bật/tắt.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Tổng", value: stats.total, tone: "bg-slate-100 text-slate-700" },
            { label: "Ghim", value: stats.pinned, tone: "bg-amber-50 text-amber-700" },
            { label: "Còn hạn", value: stats.active, tone: "bg-emerald-50 text-emerald-700" },
            { label: "Hết hạn", value: stats.expired, tone: "bg-red-50 text-red-600" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl px-3 py-2 text-center ${s.tone}`}>
              <p className="text-lg font-bold leading-none">{s.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </header>

      <section className={`${adminCardClass} overflow-hidden`}>
        <div className="border-b border-[#E7E9EE] bg-linear-to-r from-amber-50/80 to-white px-5 py-4">
          <h2 className={adminSectionTitleClass}>Tạo story mới</h2>
          <p className={`mt-0.5 ${adminSectionDescClass}`}>Chọn user, media và tuỳ chọn ghim trước khi đăng</p>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={adminLabelClass}>
                  <User size={12} className="mr-1 inline" />
                  User đăng story
                </label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={adminInputClass}
                >
                  <option value="">Chọn user…</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={adminLabelClass}>Loại media</label>
                <div className="flex gap-2">
                  {(["IMAGE", "VIDEO"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setMediaType(type);
                        setGalleryUrl("");
                      }}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        mediaType === type
                          ? "border-amber-500 bg-amber-50 text-amber-800"
                          : "border-[#E7E9EE] bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {type === "IMAGE" ? <ImageIcon size={15} /> : <Film size={15} />}
                      {type === "IMAGE" ? "Ảnh" : "Video"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!userId || uploading}
                onClick={() => setGalleryOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E7E9EE] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50/50 disabled:opacity-50"
              >
                <Sparkles size={16} className="text-amber-600" />
                Chọn từ Gallery
              </button>

              <input
                ref={fileRef}
                type="file"
                accept={mediaType === "VIDEO" ? "video/*" : "image/*"}
                className="hidden"
                onChange={handleUpload}
              />
              <button
                type="button"
                disabled={!userId || uploading}
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E7E9EE] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-50"
              >
                <Upload size={16} />
                Upload file
              </button>

              {galleryUrl && (
                <button
                  type="button"
                  disabled={!userId || uploading}
                  onClick={handleGalleryCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {uploading ? "Đang tạo…" : "Đăng story"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsPinned((v) => !v)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition sm:max-w-md ${
                isPinned
                  ? "border-amber-300 bg-amber-50"
                  : "border-[#E7E9EE] bg-slate-50/50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    isPinned ? "bg-amber-500 text-white" : "bg-white text-slate-400"
                  }`}
                >
                  <Pin size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ghim story</p>
                  <p className="text-xs text-slate-500">Hiển thị mãi mãi, bỏ qua thời gian hết hạn 24h</p>
                </div>
              </div>
              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  isPinned ? "bg-amber-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    isPinned ? "left-5" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E7E9EE] bg-slate-50/80 p-4">
            {galleryUrl ? (
              <div className="relative aspect-9/16 w-full max-w-[180px] overflow-hidden rounded-xl shadow-md">
                {mediaType === "VIDEO" ? (
                  <div className="flex h-full items-center justify-center bg-slate-200">
                    <Film size={32} className="text-slate-400" />
                  </div>
                ) : (
                  <img src={galleryUrl} alt="Preview" className="h-full w-full object-cover" />
                )}
                {isPinned && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <Pin size={10} />
                    Ghim
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setGalleryUrl("")}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white backdrop-blur-sm hover:bg-black/70"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                  <ImageIcon size={22} />
                </div>
                <p className="text-sm font-medium">Preview</p>
                <p className="mt-1 text-xs">Chọn media từ Gallery để xem trước</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={adminSectionTitleClass}>Danh sách story ({stories.length})</h2>
          <p className={`hidden sm:block ${adminSectionDescClass}`}>
            Bấm icon ghim trên preview để bật/tắt — story ghim hiển thị vĩnh viễn
          </p>
        </div>

        {stories.length === 0 ? (
          <div className={`${adminCardClass} px-6 py-16 text-center`}>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Sparkles size={24} />
            </div>
            <p className="font-medium text-slate-700">Chưa có story nào</p>
            <p className={`mt-1 ${adminSectionDescClass}`}>Tạo story đầu tiên bằng form phía trên</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                pinning={pinningId}
                onTogglePin={handleTogglePin}
                onDelete={deleteStory}
              />
            ))}
          </div>
        )}
      </section>

      <GalleryPickerModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        selectedUrl={galleryUrl}
        imagesOnly={mediaType === "IMAGE"}
        title={mediaType === "VIDEO" ? "Chọn video từ Gallery" : "Chọn ảnh từ Gallery"}
        description="Chọn media đã upload trong Gallery để tạo story"
        onSelect={(url) => {
          setGalleryUrl(url);
          setGalleryOpen(false);
        }}
      />
    </div>
  );
}
