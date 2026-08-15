import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard";
import BlogFeaturedSlider from "../components/blog/BlogFeaturedSlider";
import BlogPagination from "../components/blog/BlogPagination";
import BlogSidebar from "../components/blog/BlogSidebar";
import BlogToolbar from "../components/blog/BlogToolbar";
import { PageLoading } from "../components/LoadingKit";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { useBlogCategories } from "../hooks/useTaxonomy";
import { filterPosts, getFeaturedPosts } from "../utils/blogUtils";

const PAGE_SIZE = 6;

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(searchParams.get("tag"));
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [page, setPage] = useState(1);

  const { posts, loading, error, refetch } = useBlogPosts({ sort });
  const { categories } = useBlogCategories();

  const categoryLabelMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c.label])),
    [categories],
  );

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
    () => filterPosts(posts, { query, category, tag, sort }),
    [posts, query, category, tag, sort],
  );

  const featuredPosts = useMemo(() => getFeaturedPosts(posts), [posts]);
  const featuredIds = useMemo(
    () => new Set(featuredPosts.map((p) => p.id)),
    [featuredPosts],
  );

  const showFeaturedSlider =
    featuredPosts.length > 0 &&
    !query &&
    !category &&
    !tag &&
    page === 1 &&
    sort === "newest";

  const gridPosts = showFeaturedSlider
    ? filtered.filter((p) => !featuredIds.has(p.id))
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
      <h1 className="sr-only">Blog</h1>

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
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-muted">Chưa có bài viết nào được xuất bản.</p>
        </div>
      ) : (
        <>
          {showFeaturedSlider ? (
            <div className="mb-8">
              <BlogFeaturedSlider posts={featuredPosts} />
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
                categories={categories}
              />

              {paginated.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
                  <p className="text-muted">Không tìm thấy bài viết phù hợp.</p>
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
              posts={posts}
              activeTag={tag}
              categoryLabels={categoryLabelMap}
              onTagSelect={(next) => {
                updateTag(next);
                resetPage();
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Blog;
