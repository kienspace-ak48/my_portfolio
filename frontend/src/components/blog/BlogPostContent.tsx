function BlogPostContent({ html }: { html: string }) {
  if (!html?.trim()) {
    return (
      <p className="text-sm text-muted">Nội dung bài viết đang được cập nhật.</p>
    );
  }

  return (
    <div
      className="prose-article blog-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default BlogPostContent;
