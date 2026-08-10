import type { BlogPost, ContentBlock } from "../types/blog";

export function getHeadings(content: ContentBlock[]) {
  return content.filter(
    (block): block is Extract<ContentBlock, { type: "heading" }> =>
      block.type === "heading" && block.level === 2,
  );
}

export function filterPosts(
  posts: BlogPost[],
  opts: {
    query?: string;
    category?: string | null;
    tag?: string | null;
    sort?: "newest" | "popular";
  },
) {
  let result = [...posts];

  if (opts.category) {
    result = result.filter((p) => p.category === opts.category);
  }

  if (opts.tag) {
    result = result.filter((p) => p.tags.includes(opts.tag!));
  }

  if (opts.query?.trim()) {
    const q = opts.query.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (opts.sort === "popular") {
    result.sort((a, b) => b.readMinutes * 10 - a.readMinutes * 10);
  } else {
    result.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  return result;
}

export function getPostBySlug(posts: BlogPost[], slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(posts: BlogPost[], current: BlogPost, limit = 3) {
  return posts
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 2;
      score += p.tags.filter((t) => current.tags.includes(t)).length;
      return { post: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

export function formatBlogDate(dateStr: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function getAllTags(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}
