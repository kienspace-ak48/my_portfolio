/**
 * Rebuild dev database: drop → migrate deploy → seed.
 * Chỉ dùng local/dev — KHÔNG chạy trên production.
 *
 * Usage: node migration/rebuild-dev-db.js
 */
require("dotenv").config();
const { execSync } = require("child_process");
const { parseMariaDbUrl } = require("../src/configs/mariadb.config");
const mariadb = require("mariadb");

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Không chạy rebuild trên production.");
    process.exit(1);
  }

  const options = parseMariaDbUrl(process.env.DATABASE_URL);
  if (!options?.database) {
    console.error("❌ DATABASE_URL không hợp lệ.");
    process.exit(1);
  }

  const dbName = options.database;
  console.log(`🔄 Rebuild database dev: ${dbName}`);

  const pool = mariadb.createPool({
    ...options,
    database: undefined,
  });

  try {
    await pool.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    await pool.query(
      `CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    console.log("✅ Database đã drop & create lại.");
  } finally {
    await pool.end();
  }

  execSync("pnpm exec prisma migrate deploy", { stdio: "inherit" });
  execSync("pnpm exec prisma generate", { stdio: "inherit" });
  execSync("node migration/seed.js", { stdio: "inherit" });

  console.log("🎉 Rebuild xong — schema snake_case + seed data.");
}

main().catch((err) => {
  console.error("❌ Rebuild thất bại:", err.message);
  process.exit(1);
});
