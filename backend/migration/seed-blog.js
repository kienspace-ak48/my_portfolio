/**
 * Seed blog demo posts (upsert theo slug).
 * Usage: pnpm seed:blog
 */
require("dotenv").config();
const prisma = require("../src/configs/prisma.config");
const { seedBlogDemoPosts } = require("../src/services/blogSeed.service");

async function main() {
  console.log("🌱 Seeding blog demo posts…");
  const result = await seedBlogDemoPosts();
  console.log(`✅ ${result.count} bài viết demo:`);
  for (const post of result.posts) {
    console.log(`   · ${post.slug}`);
  }
}

main()
  .catch((err) => {
    console.error("❌ Seed blog thất bại:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
