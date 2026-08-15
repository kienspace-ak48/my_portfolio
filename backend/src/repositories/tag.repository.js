const prisma = require("../configs/prisma.config");
const { slugify } = require("../utils/slug.util");

const tagRepository = {
  async findAllAdmin() {
    const rows = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            projects: true,
            blogPosts: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      projectCount: row._count.projects,
      blogPostCount: row._count.blogPosts,
      usageCount: row._count.projects + row._count.blogPosts,
    }));
  },

  async create({ name }) {
    const trimmed = name?.trim();
    if (!trimmed) throw new Error("Tên tag là bắt buộc");

    return prisma.tag.create({
      data: {
        name: trimmed,
        slug: slugify(trimmed),
      },
    });
  },

  async update(id, { name }) {
    const trimmed = name?.trim();
    if (!trimmed) throw new Error("Tên tag là bắt buộc");

    return prisma.tag.update({
      where: { id },
      data: {
        name: trimmed,
        slug: slugify(trimmed),
      },
    });
  },

  async remove(id) {
    return prisma.tag.delete({ where: { id } });
  },
};

module.exports = tagRepository;
