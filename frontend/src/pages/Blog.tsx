import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard";
import BlogFeaturedHero from "../components/blog/BlogFeaturedHero";
import BlogPagination from "../components/blog/BlogPagination";
import BlogSidebar from "../components/blog/BlogSidebar";
import BlogToolbar from "../components/blog/BlogToolbar";
import { BLOG_POSTS } from "../data/blogPosts";
import { filterPosts } from "../utils/blogUtils";

const PAGE_SIZE = 6;

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(searchParams.get("tag"));
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setTag(searchParams.get("tag"));
  }, [searchParams]);

  function updateTag(next: string | null) {
    setTag(next);
    if (next) {
      setSearchParams({ tag: next });
    } else {
      setSearchParams({});
    }
  }

  const filtered = useMemo(
    () => filterPosts(BLOG_POSTS, { query, category, tag, sort }),
    [query, category, tag, sort],
  );

  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const showFeatured =
    !query && !category && !tag && page === 1 && sort === "newest";

  const gridPosts = showFeatured
    ? filtered.filter((p) => p.id !== featured.id)
    : filtered;

  const totalPages = Math.max(1, Math.ceil(gridPosts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = gridPosts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="pb-8">
      <header className="mb-8">
        <p className="font-mono-ui text-xs uppercase tracking-[0.14em] text-subtle">
          Blog kỹ thuật
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Ghi chép & bài học
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Chia sẻ quá trình build sản phẩm thật — backend, frontend, deploy và
          những lỗi đã gặp. (Frontend demo với mock data)
        </p>
      </header>

      {showFeatured ? (
        <div className="mb-8">
          <BlogFeaturedHero post={featured} />
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1fr_300px] xl:gap-10">
        <div className="min-w-0 space-y-6">
          <BlogToolbar
            query={query}
            onQueryChange={(v) => {
              setQuery(v);
              resetPage();
            }}
            category={category}
            onCategoryChange={(v) => {
              setCategory(v);
              resetPage();
            }}
            sort={sort}
            onSortChange={(v) => {
              setSort(v);
              resetPage();
            }}
            resultCount={filtered.length}
          />

          {tag ? (
            <p className="text-sm text-muted">
              Đang lọc tag:{" "}
              <button
                type="button"
                onClick={() => updateTag(null)}
                className="font-semibold text-brand hover:underline"
              >
                #{tag} ×
              </button>
            </p>
          ) : null}

          {paginated.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
              <p className="font-medium text-ink">Không tìm thấy bài viết</p>
              <p className="mt-1 text-sm text-muted">
                Thử đổi từ khóa hoặc bỏ bộ lọc.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {paginated.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <BlogPagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        <BlogSidebar
          posts={BLOG_POSTS}
          activeTag={tag}
          onTagSelect={(t) => {
            updateTag(t);
            resetPage();
          }}
        />
      </div>
    </div>
  );
}

export default Blog;
