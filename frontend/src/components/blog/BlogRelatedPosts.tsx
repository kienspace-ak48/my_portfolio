import type { BlogPost } from "../../types/blog";
import BlogCard from "./BlogCard";

type BlogRelatedPostsProps = {
  posts: BlogPost[];
};

function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-lg font-bold text-ink sm:text-xl">
        Bài liên quan
      </h2>
      <div className="mt-4 space-y-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}

export default BlogRelatedPosts;
