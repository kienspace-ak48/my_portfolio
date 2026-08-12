/**
 * Export snapshot DB → migration/data/db-export.json
 * Chạy local sau khi chỉnh data xong, commit file export lên repo, rồi trên VPS: pnpm seed
 *
 * Usage: pnpm db:export
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const prisma = require("../src/configs/prisma.config");

const OUT_DIR = path.join(__dirname, "data");
const OUT_FILE = path.join(OUT_DIR, "db-export.json");

async function main() {
  console.log("📤 Đang export database…");

  const [
    users,
    tags,
    projects,
    projectTags,
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
    prisma.story.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.storyView.findMany({ orderBy: { viewedAt: "asc" } }),
    prisma.galleryAsset.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.seoGlobalSettings.findMany(),
    prisma.seoPageTemplate.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    prisma.resumeSettings.findMany(),
  ]);

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    users,
    tags,
    projects,
    projectTags,
    stories,
    storyViews,
    galleryAssets,
    seoGlobalSettings,
    seoPageTemplates,
    resumeSettings,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");

  console.log(`✅ Export xong: ${OUT_FILE}`);
  console.log(
    [
      `users=${users.length}`,
      `projects=${projects.length}`,
      `tags=${tags.length}`,
      `stories=${stories.length}`,
      `gallery=${galleryAssets.length}`,
      `seoPages=${seoPageTemplates.length}`,
      `resume=${resumeSettings.length}`,
    ].join(", "),
  );
  console.log("   Commit file này rồi trên VPS: pnpm exec prisma migrate deploy && pnpm seed");
}

main()
  .catch((err) => {
    console.error("❌ Export thất bại:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
