import { Tag } from "lucide-react";
import type { BlogPost } from "../../types/blog";
import { BLOG_CATEGORY_LABELS } from "../../types/blog";
import { getAllTags } from "../../utils/blogUtils";
import BlogCard from "./BlogCard";
import BlogNewsletter from "./BlogNewsletter";

type BlogSidebarProps = {
  posts: BlogPost[];
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
};

function BlogSidebar({ posts, activeTag, onTagSelect }: BlogSidebarProps) {
  const popular = [...posts]
    .sort((a, b) => b.readMinutes - a.readMinutes)
    .slice(0, 4);
  const tags = getAllTags(posts).slice(0, 10);

  const categoryCounts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-sm font-bold text-ink">Đọc nhiều</h3>
        <div className="mt-3 divide-y divide-border">
          {popular.map((post) => (
            <div key={post.id} className="py-3 first:pt-0 last:pb-0">
              <BlogCard post={post} variant="compact" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="text-sm font-bold text-ink">Chủ đề</h3>
        <ul className="mt-3 space-y-1">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <li key={cat}>
              <span className="flex justify-between py-1.5 text-sm text-body">
                <span>{BLOG_CATEGORY_LABELS[cat as keyof typeof BLOG_CATEGORY_LABELS]}</span>
                <span className="font-mono-ui text-xs text-subtle">{count}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
          <Tag size={15} aria-hidden />
          Tags
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagSelect(activeTag === tag ? null : tag)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                activeTag === tag
                  ? "bg-brand text-white"
                  : "bg-app text-muted hover:bg-hover hover:text-ink"
              }`}
            >
              {tag}
              <span className="ml-1 opacity-60">({count})</span>
            </button>
          ))}
        </div>
      </div>

      <BlogNewsletter />
    </aside>
  );
}

export default BlogSidebar;
