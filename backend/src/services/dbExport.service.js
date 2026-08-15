const fs = require("fs");
const path = require("path");
const prisma = require("../configs/prisma.config");
const { ROOT_PATH } = require("../configs/myPath.config");

const BACKUPS_DIR = path.join(ROOT_PATH, "backups");

async function fetchAllTables() {
  const [
    users,
    tags,
    projects,
    projectTags,
    blogPosts,
    blogPostTags,
    blogCategories,
    stories,
    storyViews,
    galleryAssets,
    seoGlobalSettings,
    seoPageTemplates,
    resumeSettings,
  ] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: "asc" } }),
    prisma.tag.findMany({ orderBy: { id: "asc" } }),
    prisma.project.findMany({ orderBy: { id: "asc" } }),
    prisma.projectTag.findMany(),
    prisma.blogPost.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.blogPostTag.findMany(),
    prisma.blogCategoryDef.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    prisma.story.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.storyView.findMany({ orderBy: { viewedAt: "asc" } }),
    prisma.galleryAsset.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.seoGlobalSettings.findMany(),
    prisma.seoPageTemplate.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    prisma.resumeSettings.findMany(),
  ]);

  return {
    users,
    tags,
    projects,
    projectTags,
    blogPosts,
    blogPostTags,
    blogCategories,
    stories,
    storyViews,
    galleryAssets,
    seoGlobalSettings,
    seoPageTemplates,
    resumeSettings,
  };
}

async function buildExportPayload() {
  const tables = await fetchAllTables();
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    ...tables,
  };
}

async function getTableStats() {
  const [
    users,
    tags,
    projects,
    blogPosts,
    stories,
    galleryAssets,
    seoPageTemplates,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tag.count(),
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.story.count(),
    prisma.galleryAsset.count(),
    prisma.seoPageTemplate.count(),
  ]);

  return {
    users,
    tags,
    projects,
    blogPosts,
    stories,
    galleryAssets,
    seoPageTemplates,
  };
}

function listSavedBackups() {
  if (!fs.existsSync(BACKUPS_DIR)) return [];

  return fs
    .readdirSync(BACKUPS_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const fullPath = path.join(BACKUPS_DIR, name);
      const stat = fs.statSync(fullPath);
      return {
        filename: name,
        sizeBytes: stat.size,
        createdAt: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function saveBackupToDisk() {
  const payload = await buildExportPayload();
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backup-${stamp}.json`;
  const fullPath = path.join(BACKUPS_DIR, filename);

  fs.writeFileSync(fullPath, JSON.stringify(payload, null, 2), "utf8");

  return {
    filename,
    fullPath,
    payload,
    sizeBytes: fs.statSync(fullPath).size,
  };
}

module.exports = {
  BACKUPS_DIR,
  fetchAllTables,
  buildExportPayload,
  getTableStats,
  listSavedBackups,
  saveBackupToDisk,
};
