const prisma = require("../configs/prisma.config");

const seoRepository = {
  findGlobal() {
    return prisma.seoGlobalSettings.findUnique({ where: { id: 1 } });
  },

  upsertGlobal(data) {
    return prisma.seoGlobalSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
  },

  findAllPageTemplates() {
    return prisma.seoPageTemplate.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
  },

  findPageTemplateByKey(pageKey) {
    return prisma.seoPageTemplate.findUnique({
      where: { pageKey },
    });
  },

  upsertPageTemplate(pageKey, data) {
    return prisma.seoPageTemplate.upsert({
      where: { pageKey },
      update: data,
      create: { pageKey, ...data },
    });
  },

  findPublicProjectsForSitemap() {
    return prisma.project.findMany({
      where: { isDisplay: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  },
};

module.exports = seoRepository;
