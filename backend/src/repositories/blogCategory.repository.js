const prisma = require("../configs/prisma.config");
const { slugify } = require("../utils/slug.util");

const blogCategoryRepository = {
  async findPublic() {
    return prisma.blogCategoryDef.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      select: {
        id: true,
        slug: true,
        label: true,
        description: true,
        sortOrder: true,
      },
    });
  },

  async findAllAdmin() {
    const rows = await prisma.blogCategoryDef.findMany({
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      label: row.label,
      description: row.description,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
      postCount: row._count.posts,
    }));
  },

  async create(data) {
    const label = data.label?.trim();
    const slug = (data.slug?.trim() || slugify(label)).toLowerCase();
    if (!label || !slug) throw new Error("Nhãn và slug là bắt buộc");

    return prisma.blogCategoryDef.create({
      data: {
        slug,
        label,
        description: data.description?.trim() || null,
        sortOrder: Number(data.sortOrder) || 0,
        isActive: data.isActive !== false,
      },
    });
  },

  async update(id, data) {
    const payload = {};

    if (data.label !== undefined) {
      const label = data.label.trim();
      if (!label) throw new Error("Nhãn không được trống");
      payload.label = label;
    }

    if (data.slug !== undefined) {
      const slug = data.slug.trim().toLowerCase();
      if (!slug) throw new Error("Slug không được trống");
      payload.slug = slug;
    }

    if (data.description !== undefined) {
      payload.description = data.description?.trim() || null;
    }

    if (data.sortOrder !== undefined) {
      payload.sortOrder = Number(data.sortOrder) || 0;
    }

    if (data.isActive !== undefined) {
      payload.isActive = Boolean(data.isActive);
    }

    const existing = await prisma.blogCategoryDef.findUnique({ where: { id } });
    if (!existing) throw new Error("Không tìm thấy danh mục");

    if (payload.slug && payload.slug !== existing.slug) {
      const postCount = await prisma.blogPost.count({
        where: { categorySlug: existing.slug },
      });
      if (postCount > 0) {
        throw new Error(
          `Không thể đổi slug — còn ${postCount} bài viết đang dùng danh mục này`,
        );
      }
    }

    return prisma.blogCategoryDef.update({
      where: { id },
      data: payload,
    });
  },

  async remove(id) {
    const existing = await prisma.blogCategoryDef.findUnique({ where: { id } });
    if (!existing) throw new Error("Không tìm thấy danh mục");

    const postCount = await prisma.blogPost.count({
      where: { categorySlug: existing.slug },
    });
    if (postCount > 0) {
      throw new Error(
        `Không thể xóa — còn ${postCount} bài viết thuộc danh mục «${existing.label}»`,
      );
    }

    return prisma.blogCategoryDef.delete({ where: { id } });
  },
};

module.exports = blogCategoryRepository;
