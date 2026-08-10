/**
 * Seed database từ migration/data/db-export.json (snapshot y hệt DB đã export).
 * Chạy SAU khi prisma migrate deploy.
 *
 * Usage: node migration/seed-from-export.js
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const prisma = require("../src/configs/prisma.config");

const IN_FILE = path.join(__dirname, "data", "db-export.json");

async function clearAll() {
  await prisma.storyView.deleteMany();
  await prisma.story.deleteMany();
  await prisma.projectTag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.galleryAsset.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  if (!fs.existsSync(IN_FILE)) {
    console.error(`❌ Không tìm thấy ${IN_FILE}`);
    console.error("   Chạy trước: node migration/export-db.js");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(IN_FILE, "utf8"));
  console.log(`🌱 Seed từ export (${data.exportedAt})…`);

  await clearAll();

  if (data.users?.length) {
    await prisma.user.createMany({ data: data.users });
  }

  if (data.tags?.length) {
    await prisma.tag.createMany({ data: data.tags });
  }

  if (data.projects?.length) {
    for (const project of data.projects) {
      await prisma.project.create({ data: project });
    }
  }

  if (data.projectTags?.length) {
    await prisma.projectTag.createMany({ data: data.projectTags });
  }

  if (data.stories?.length) {
    await prisma.story.createMany({ data: data.stories });
  }

  if (data.storyViews?.length) {
    await prisma.storyView.createMany({ data: data.storyViews });
  }

  if (data.galleryAssets?.length) {
    await prisma.galleryAsset.createMany({ data: data.galleryAssets });
  }

  console.log("🎉 Seed from export hoàn tất — dữ liệu khớp file export.");
}

main()
  .catch((err) => {
    console.error("❌ Seed from export thất bại:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
