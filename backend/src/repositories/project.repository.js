const prisma = require("../configs/prisma.config");
const { slugify } = require("../utils/slug.util");

const TAGS_INCLUDE = {
  tags: {
    include: {
      tag: true,
    },
  },
};

function normalizeFeatures(features) {
  if (!features) return [];
  if (Array.isArray(features)) {
    return features.filter((item) => typeof item === "string" && item.trim());
  }
  return [];
}

function serializeProject(project) {
  if (!project) return null;

  return {
    ...project,
    tags: (project.tags ?? []).map((row) => row.tag.name),
    features: normalizeFeatures(project.features),
  };
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

async function syncProjectTags(tx, projectId, tagNames = []) {
  await tx.projectTag.deleteMany({ where: { projectId } });
  const tags = await upsertTags(tx, tagNames);

  if (tags.length === 0) return;

  await tx.projectTag.createMany({
    data: tags.map((tag) => ({
      projectId,
      tagId: tag.id,
    })),
  });
}

function buildPublicWhere(query = {}) {
  const where = { isDisplay: true };

  if (query.featured === "true") {
    where.featured = true;
  }

  if (query.status) {
    const statusMap = {
      completed: "COMPLETED",
      "in-progress": "IN_PROGRESS",
      archived: "ARCHIVED",
    };
    if (statusMap[query.status]) {
      where.status = statusMap[query.status];
    }
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
      { desc: { contains: q } },
      { sumary: { contains: q } },
      { badge: { contains: q } },
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
  if (sort === "name") {
    return { title: "asc" };
  }
  if (sort === "newest") {
    return [{ finishedAt: "desc" }, { createdAt: "desc" }];
  }
  return [{ featured: "desc" }, { finishedAt: "desc" }, { createdAt: "desc" }];
}

class ProjectRepository {
  async findPublic(query = {}) {
    const projects = await prisma.project.findMany({
      where: buildPublicWhere(query),
      include: TAGS_INCLUDE,
      orderBy: buildOrderBy(query.sort),
    });

    return projects.map(serializeProject);
  }

  async findAllAdmin() {
    const projects = await prisma.project.findMany({
      include: TAGS_INCLUDE,
      orderBy: [{ updatedAt: "desc" }],
    });

    return projects.map(serializeProject);
  }

  async findById(id) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: TAGS_INCLUDE,
    });

    return serializeProject(project);
  }

  async findBySlug(slug, { incrementView = false } = {}) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: TAGS_INCLUDE,
    });

    if (!project) return null;

    if (incrementView) {
      await prisma.project.update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      });
      project.viewCount += 1;
    }

    return serializeProject(project);
  }

  async findTagStats() {
    const rows = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            projects: {
              where: {
                project: { isDisplay: true },
              },
            },
          },
        },
      },
      orderBy: {
        projects: {
          _count: "desc",
        },
      },
    });

    return rows
      .filter((row) => row._count.projects > 0)
      .map((row) => ({
        tag: row.name,
        count: row._count.projects,
      }));
  }

  async create(data) {
    const { tags, features, ...projectData } = data;

    const created = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          ...projectData,
          features: normalizeFeatures(features),
        },
      });

      await syncProjectTags(tx, project.id, tags);
      return project.id;
    });

    return this.findById(created);
  }

  async update(id, data) {
    const { tags, features, ...projectData } = data;

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: {
          ...projectData,
          ...(features !== undefined
            ? { features: normalizeFeatures(features) }
            : {}),
        },
      });

      if (tags !== undefined) {
        await syncProjectTags(tx, id, tags);
      }
    });

    return this.findById(id);
  }

  async remove(id) {
    return prisma.project.delete({ where: { id } });
  }
}

module.exports = new ProjectRepository();
