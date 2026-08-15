const prisma = require("../configs/prisma.config");
const { slugify } = require("../utils/slug.util");

const TAGS_INCLUDE = {
  tags: {
    include: {
      tag: true,
    },
  },
};

const AUTHOR_INCLUDE = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

const CATEGORY_INCLUDE = {
  categoryRef: {
    select: {
      slug: true,
      label: true,
    },
  },
};

const CATEGORY_TO_API = {
  BACKEND: "backend",
  FRONTEND: "frontend",
  DEVOPS: "devops",
  CAREER: "career",
  TUTORIAL: "tutorial",
};

function normalizeCategorySlug(value) {
  if (!value) return "tutorial";
  const raw = String(value).trim().toLowerCase();
  if (CATEGORY_TO_API[raw]) return CATEGORY_TO_API[raw];
  return raw.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "tutorial";
}

function estimateReadMinutes(html = "") {
  const text = String(html).replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function serializeAuthor(user) {
  if (!user) return null;
  return {
    id: String(user.id),
    name: user.name,
    role: "Fullstack Developer",
    avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}`,
    bio: "",
  };
}

function serializePost(post, { includeContent = true } = {}) {
  if (!post) return null;

  const base = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverUrl: post.coverUrl ?? "",
    category: post.categorySlug ?? "tutorial",
    categoryLabel: post.categoryRef?.label ?? post.categorySlug ?? "tutorial",
    tags: (post.tags ?? []).map((row) => row.tag.name),
    authorId: String(post.authorId),
    author: serializeAuthor(post.author),
    authorName: post.author?.name ?? "",
    publishedAt: post.publishedAt?.toISOString?.() ?? post.createdAt?.toISOString?.(),
    updatedAt: post.updatedAt?.toISOString?.(),
    readMinutes: post.readMinutes,
    featured: post.featured,
    featuredOrder: post.featuredOrder ?? 0,
    viewCount: post.viewCount,
    status: post.status,
    isDisplay: post.isDisplay,
  };

  if (includeContent) {
    base.content = post.content ?? "";
  }

  return base;
}

async function upsertTags(tx, tagNames = []) {
  const unique = [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))];
  const tags = [];

  for (const name of unique) {
    const tagSlug = slugify(name);
    const tag = await tx.tag.upsert({
      where: { slug: tagSlug },
      update: { name },
      create: { name, slug: tagSlug },
    });
    tags.push(tag);
  }

  return tags;
}

async function syncBlogPostTags(tx, blogPostId, tagNames = []) {
  await tx.blogPostTag.deleteMany({ where: { blogPostId } });
  const tags = await upsertTags(tx, tagNames);

  if (tags.length === 0) return;

  await tx.blogPostTag.createMany({
    data: tags.map((tag) => ({
      blogPostId,
      tagId: tag.id,
    })),
  });
}

function buildPublicWhere(query = {}) {
  const where = {
    isDisplay: true,
    status: "PUBLISHED",
  };

  if (query.featured === "true") {
    where.featured = true;
  }

  if (query.category) {
    where.categorySlug = normalizeCategorySlug(query.category);
  }

  if (query.tag) {
    where.tags = {
      some: {
        tag: {
          name: query.tag,
        },
      },
    };
  }

  if (query.q?.trim()) {
    const q = query.q.trim();
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      {
        tags: {
          some: {
            tag: { name: { contains: q } },
          },
        },
      },
    ];
  }

  return where;
}

function buildOrderBy(sort) {
  if (sort === "popular") {
    return [{ viewCount: "desc" }, { publishedAt: "desc" }];
  }
  return [{ publishedAt: "desc" }, { createdAt: "desc" }];
}

class BlogRepository {
  async findPublic(query = {}) {
    const posts = await prisma.blogPost.findMany({
      where: buildPublicWhere(query),
      include: { ...TAGS_INCLUDE, ...AUTHOR_INCLUDE, ...CATEGORY_INCLUDE },
      orderBy: buildOrderBy(query.sort),
    });

    return posts.map((post) => serializePost(post, { includeContent: false }));
  }

  async findAllAdmin() {
    const posts = await prisma.blogPost.findMany({
      include: { ...TAGS_INCLUDE, ...AUTHOR_INCLUDE, ...CATEGORY_INCLUDE },
      orderBy: [{ updatedAt: "desc" }],
    });

    return posts.map((post) => serializePost(post, { includeContent: false }));
  }

  async findById(id) {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { ...TAGS_INCLUDE, ...AUTHOR_INCLUDE, ...CATEGORY_INCLUDE },
    });

    return serializePost(post);
  }

  async findBySlug(slug, { incrementView = false } = {}) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { ...TAGS_INCLUDE, ...AUTHOR_INCLUDE, ...CATEGORY_INCLUDE },
    });

    if (!post) return null;

    if (incrementView) {
      await prisma.blogPost.update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      });
      post.viewCount += 1;
    }

    return serializePost(post);
  }

  async findTagStats() {
    const rows = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            blogPosts: {
              where: {
                blogPost: {
                  isDisplay: true,
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
      },
      orderBy: {
        blogPosts: {
          _count: "desc",
        },
      },
    });

    return rows
      .filter((row) => row._count.blogPosts > 0)
      .map((row) => ({
        tag: row.name,
        count: row._count.blogPosts,
      }));
  }

  async findPublicForSitemap() {
    return prisma.blogPost.findMany({
      where: { isDisplay: true, status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, title: true, excerpt: true, coverUrl: true },
      orderBy: { publishedAt: "desc" },
    });
  }

  async findSeoBySlug(slug) {
    const post = await prisma.blogPost.findFirst({
      where: { slug, isDisplay: true, status: "PUBLISHED" },
      include: AUTHOR_INCLUDE,
    });

    if (!post) return null;

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      coverUrl: post.coverUrl ?? "",
      authorName: post.author?.name ?? "",
    };
  }

  async create(data, authorId) {
    const { tags, content, category, categorySlug, status, publishedAt, readMinutes, ...rest } = data;

    const created = await prisma.$transaction(async (tx) => {
      const post = await tx.blogPost.create({
        data: {
          ...rest,
          authorId,
          categorySlug: normalizeCategorySlug(categorySlug ?? category),
          status: status ?? "DRAFT",
          content: content ?? "",
          readMinutes: readMinutes ?? estimateReadMinutes(content),
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      await syncBlogPostTags(tx, post.id, tags);
      return post.id;
    });

    return this.findById(created);
  }

  async update(id, data) {
    const { tags, content, category, categorySlug, status, publishedAt, readMinutes, ...rest } = data;

    await prisma.$transaction(async (tx) => {
      const updateData = { ...rest };

      if (category !== undefined || categorySlug !== undefined) {
        updateData.categorySlug = normalizeCategorySlug(categorySlug ?? category);
      }
      if (status !== undefined) updateData.status = status;
      if (content !== undefined) {
        updateData.content = content;
        if (readMinutes === undefined) {
          updateData.readMinutes = estimateReadMinutes(content);
        }
      }
      if (readMinutes !== undefined) updateData.readMinutes = readMinutes;
      if (publishedAt !== undefined) {
        updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
      }

      await tx.blogPost.update({
        where: { id },
        data: updateData,
      });

      if (tags !== undefined) {
        await syncBlogPostTags(tx, id, tags);
      }
    });

    return this.findById(id);
  }

  async remove(id) {
    return prisma.blogPost.delete({ where: { id } });
  }
}

module.exports = new BlogRepository();
