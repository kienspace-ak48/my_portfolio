/**
 * Export toàn bộ dữ liệu DB hiện tại → migration/data/db-export.json
 * Dùng làm snapshot để seed lại y hệt (dev/VPS mới).
 *
 * Usage: node migration/export-db.js
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
  ] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: "asc" } }),
    prisma.tag.findMany({ orderBy: { id: "asc" } }),
    prisma.project.findMany({ orderBy: { id: "asc" } }),
    prisma.projectTag.findMany(),
    prisma.story.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.storyView.findMany({ orderBy: { viewedAt: "asc" } }),
    prisma.galleryAsset.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    users,
    tags,
    projects,
    projectTags,
    stories,
    storyViews,
    galleryAssets,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");

  console.log(`✅ Export xong: ${OUT_FILE}`);
  console.log(
    `   users=${users.length}, projects=${projects.length}, tags=${tags.length}, stories=${stories.length}, gallery=${galleryAssets.length}`,
  );
}

main()
  .catch((err) => {
    console.error("❌ Export thất bại:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
