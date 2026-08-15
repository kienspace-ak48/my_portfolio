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

const REQUIRED_MODELS = [
  "storyView",
  "story",
  "blogPostTag",
  "blogPost",
  "blogCategoryDef",
  "projectTag",
  "project",
  "tag",
  "galleryAsset",
  "refreshToken",
  "seoPageTemplate",
  "seoGlobalSettings",
  "resumeSettings",
  "user",
];

function assertPrismaClient() {
  const missing = REQUIRED_MODELS.filter((name) => typeof prisma[name]?.deleteMany !== "function");
  if (missing.length === 0) return;

  throw new Error(
    [
      `Prisma client thiếu model: ${missing.join(", ")}`,
      "Trên VPS chạy theo thứ tự:",
      "  1. pnpm install",
      "  2. pnpm exec prisma migrate deploy",
      "  3. pnpm seed",
      "(src/generated/prisma không commit git — cần prisma generate sau mỗi lần pull)",
    ].join("\n"),
  );
}

async function clearAll() {
  await prisma.storyView.deleteMany();
  await prisma.story.deleteMany();
  await prisma.blogPostTag.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategoryDef.deleteMany();
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

  assertPrismaClient();
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

  if (data.blogCategories?.length) {
    await prisma.blogCategoryDef.createMany({ data: data.blogCategories });
  }

  if (data.blogPosts?.length) {
    await prisma.blogPost.createMany({ data: data.blogPosts });
  }

  if (data.blogPostTags?.length) {
    await prisma.blogPostTag.createMany({ data: data.blogPostTags });
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
