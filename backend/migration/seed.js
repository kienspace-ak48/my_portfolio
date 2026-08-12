/**
 * Seed database từ migration/data/db-export.json
 * Chạy SAU prisma migrate deploy (local hoặc VPS).
 *
 * Usage: pnpm seed
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
  await prisma.seoPageTemplate.deleteMany();
  await prisma.seoGlobalSettings.deleteMany();
  await prisma.resumeSettings.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  if (!fs.existsSync(IN_FILE)) {
    console.error(`❌ Không tìm thấy ${IN_FILE}`);
    console.error("   Chạy trước trên máy local: pnpm db:export");
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

  if (data.seoGlobalSettings?.length) {
    for (const row of data.seoGlobalSettings) {
      await prisma.seoGlobalSettings.create({ data: row });
    }
  }

  if (data.seoPageTemplates?.length) {
    await prisma.seoPageTemplate.createMany({ data: data.seoPageTemplates });
  }

  if (data.resumeSettings?.length) {
    for (const row of data.resumeSettings) {
      await prisma.resumeSettings.create({ data: row });
    }
  }

  console.log("🎉 Seed hoàn tất — dữ liệu khớp db-export.json");
}

main()
  .catch((err) => {
    console.error("❌ Seed thất bại:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
