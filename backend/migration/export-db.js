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
const dbExportService = require("../src/services/dbExport.service");

const OUT_DIR = path.join(__dirname, "data");
const OUT_FILE = path.join(OUT_DIR, "db-export.json");

async function main() {
  console.log("📤 Đang export database…");

  const payload = await dbExportService.buildExportPayload();

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");

  console.log(`✅ Export xong: ${OUT_FILE}`);
  console.log(
    [
      `users=${payload.users.length}`,
      `projects=${payload.projects.length}`,
      `blogPosts=${payload.blogPosts.length}`,
      `tags=${payload.tags.length}`,
      `stories=${payload.stories.length}`,
      `gallery=${payload.galleryAssets.length}`,
      `seoPages=${payload.seoPageTemplates.length}`,
      `resume=${payload.resumeSettings.length}`,
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
