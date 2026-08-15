const prisma = require("../configs/prisma.config");
const { slugify } = require("../utils/slug.util");
const { BLOG_SEED_POSTS } = require("../data/blogSeed.data");

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

async function seedBlogDemoPosts() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { id: "asc" },
  });

  if (!admin) {
    throw new Error("Chưa có user ADMIN — tạo tài khoản admin trước khi seed blog demo");
  }

  const results = [];

  for (const seed of BLOG_SEED_POSTS) {
    const { tags, updatedAt, ...postData } = seed;

    const post = await prisma.$transaction(async (tx) => {
      const existing = await tx.blogPost.findUnique({
        where: { slug: postData.slug },
      });

      const data = {
        ...postData,
        authorId: admin.id,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : null,
        ...(updatedAt ? { updatedAt: new Date(updatedAt) } : {}),
      };

      let saved;
      if (existing) {
        saved = await tx.blogPost.update({
          where: { id: existing.id },
          data,
        });
      } else {
        saved = await tx.blogPost.create({ data });
      }

      await syncBlogPostTags(tx, saved.id, tags);

      if (updatedAt) {
        await tx.$executeRawUnsafe(
          "UPDATE blog_post SET updated_at = ? WHERE id = ?",
          new Date(updatedAt),
          saved.id,
        );
      }

      return saved;
    });

    results.push({ slug: post.slug, id: post.id, title: post.title });
  }

  return {
    count: results.length,
    posts: results,
  };
}

module.exports = { seedBlogDemoPosts };
