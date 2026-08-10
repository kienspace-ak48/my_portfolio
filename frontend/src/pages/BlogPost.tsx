import { ArrowLeft, Clock } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import BlogCommentsSection from "../components/blog/BlogCommentsSection";
import BlogAuthorCard from "../components/blog/BlogAuthorCard";
import BlogPostContent from "../components/blog/BlogPostContent";
import BlogReadingProgress from "../components/blog/BlogReadingProgress";
import BlogRelatedPosts from "../components/blog/BlogRelatedPosts";
import BlogShareBar from "../components/blog/BlogShareBar";
import BlogTableOfContents from "../components/blog/BlogTableOfContents";
import { BLOG_POSTS, getBlogAuthor } from "../data/blogPosts";
import { BLOG_CATEGORY_LABELS } from "../types/blog";
import {
  formatBlogDate,
  getPostBySlug,
  getRelatedPosts,
} from "../utils/blogUtils";

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(BLOG_POSTS, slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const author = getBlogAuthor(post.authorId);
  const related = getRelatedPosts(BLOG_POSTS, post);

  return (
    <>
      <BlogReadingProgress />

      <article className="pb-10">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
        >
          <ArrowLeft size={16} aria-hidden />
          Quay lại blog
        </Link>

        <header className="mb-8 overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="relative aspect-[2/1] max-h-[420px] w-full sm:aspect-[21/9]">
            <img
              src={post.coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-6 sm:p-10">
              <span className="rounded-lg bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                {BLOG_CATEGORY_LABELS[post.category]}
              </span>
              <h1 className="mt-4 max-w-4xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                {post.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-6 py-4 text-sm text-muted sm:px-10">
            {author ? (
              <div className="flex items-center gap-2">
                <img
                  src={author.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="font-medium text-ink">{author.name}</span>
              </div>
            ) : null}
            <span className="text-subtle">·</span>
            <time dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt)}
            </time>
            {post.updatedAt ? (
              <>
                <span className="text-subtle">·</span>
                <span>Cập nhật {formatBlogDate(post.updatedAt)}</span>
              </>
            ) : null}
            <span className="ml-auto inline-flex items-center gap-1 text-subtle">
              <Clock size={14} aria-hidden />
              {post.readMinutes} phút đọc
            </span>
          </div>
        </header>

        <div className="grid gap-10 xl:grid-cols-[1fr_240px] xl:gap-12">
          <div className="min-w-0 space-y-8">
            <p className="text-lg leading-relaxed text-body sm:text-xl">
              {post.excerpt}
            </p>

            <div className="xl:hidden">
              <BlogTableOfContents content={post.content} />
            </div>

            <BlogShareBar title={post.title} slug={post.slug} />

            <BlogPostContent blocks={post.content} />

            <div className="flex flex-wrap gap-2 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-lg bg-app px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-brand-soft hover:text-brand"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {author ? <BlogAuthorCard author={author} /> : null}

            <BlogCommentsSection postId={post.id} />

            <BlogRelatedPosts posts={related} />
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <BlogTableOfContents content={post.content} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

export default BlogPostPage;
