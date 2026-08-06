import { useMemo } from "react";
import { Film, Image as ImageIcon } from "lucide-react";
import useProjects from "../../hooks/useProjects";
import useAdminStories from "../../hooks/useAdminStories";
import type { GalleryItem } from "../../types/story";
import { PageLoading } from "../../components/LoadingKit";

export default function GalleryPage() {
  const { projects, loading: loadingProjects } = useProjects();
  const { stories, loading: loadingStories } = useAdminStories();

  const items = useMemo<GalleryItem[]>(() => {
    const projectItems: GalleryItem[] = projects
      .filter((p) => p.thumbnail)
      .map((p) => ({
        id: `project-${p.id}`,
        source: "project",
        title: p.title,
        mediaUrl: p.thumbnail!,
        mediaType: "IMAGE",
      }));

    const storyItems: GalleryItem[] = stories.map((s) => ({
      id: `story-${s.id}`,
      source: "story",
      title: s.user?.name ?? "Story",
      mediaUrl: s.thumbnailUrl ?? s.mediaUrl,
      mediaType: s.mediaType,
      createdAt: s.createdAt,
    }));

    return [...projectItems, ...storyItems];
  }, [projects, stories]);

  const loading = loadingProjects || loadingStories;

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tổng hợp media từ Project.thumbnail và Story.mediaUrl (chưa có model Gallery riêng)
          </p>
        </div>
        <PageLoading
          variant="embedded"
          title="Đang tải gallery"
          message="Đang lấy media từ dự án và stories…"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tổng hợp media từ Project.thumbnail và Story.mediaUrl (chưa có model Gallery riêng)
        </p>
      </div>

      {items.length === 0 && (
        <p className="rounded-xl border bg-white p-8 text-center text-slate-400" style={{ borderColor: "#E7E9EE" }}>
          Chưa có media nào
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border bg-white"
            style={{ borderColor: "#E7E9EE" }}
          >
            <div className="relative aspect-[4/3] bg-slate-100">
              <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover" />
              <span
                className="absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-semibold uppercase text-white"
                style={{ background: item.source === "project" ? "#B45309" : "#475069" }}
              >
                {item.source}
              </span>
              {item.mediaType === "VIDEO" && (
                <span className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white">
                  <Film size={14} />
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                {item.mediaType === "VIDEO" ? <Film size={12} /> : <ImageIcon size={12} />}
                {item.mediaType}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
