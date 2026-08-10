const { Role, MediaType, ProjectStatus } = require("../src/generated/prisma");
const prisma = require("../src/configs/prisma.config");
const bcrypt = require("bcrypt");
const { slugify } = require("../src/utils/slug.util");

async function upsertTag(name) {
  const tagSlug = slugify(name);
  return prisma.tag.upsert({
    where: { slug: tagSlug },
    update: { name },
    create: { name, slug: tagSlug },
  });
}

async function linkTags(projectId, tagNames) {
  for (const name of tagNames) {
    const tag = await upsertTag(name);
    await prisma.projectTag.upsert({
      where: {
        projectId_tagId: { projectId, tagId: tag.id },
      },
      update: {},
      create: { projectId, tagId: tag.id },
    });
  }
}

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...");

  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@devmarket.vn" },
    update: {},
    create: {
      name: "Vũ Văn Kiên",
      email: "admin@devmarket.vn",
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "minh.tran@devmarket.vn" },
    update: {},
    create: {
      name: "Trần Minh",
      email: "minh.tran@devmarket.vn",
      password: passwordHash,
      role: Role.USER,
    },
  });

  await prisma.user.upsert({
    where: { email: "lan.nguyen@devmarket.vn" },
    update: {},
    create: {
      name: "Nguyễn Lan",
      email: "lan.nguyen@devmarket.vn",
      password: passwordHash,
      role: Role.USER,
    },
  });

  await prisma.user.upsert({
    where: { email: "hung.pham@devmarket.vn" },
    update: {},
    create: {
      name: "Phạm Hùng",
      email: "hung.pham@devmarket.vn",
      password: passwordHash,
      role: Role.USER,
    },
  });

  console.log("✅ Đã tạo users");

  const projectsData = [
    {
      slug: "devmarket-source-marketplace",
      title: "DevMarket - Source Code Marketplace",
      badge: "Full-stack",
      sumary: "Nền tảng mua bán source code cho lập trình viên",
      desc: "Chợ source code với hệ thống thanh toán VNPay/MoMo, quản lý dự án, tag lọc.",
      longDesc:
        "<p>DevMarket là nền tảng cho phép developer đăng bán source code, quản lý bằng Prisma + MySQL, admin dashboard xây bằng React.</p><p>Hệ thống hỗ trợ tìm kiếm, phân loại theo tech stack và quản lý portfolio người bán.</p>",
      thumbnail: "https://picsum.photos/seed/devmarket/1200/750",
      status: ProjectStatus.COMPLETED,
      isDisplay: true,
      finishedAt: new Date("2026-06-15"),
      demoUrl: "https://devmarket.vn",
      repoUrl: "https://github.com/kien/devmarket",
      featured: true,
      viewCount: 1240,
      features: [
        "Tìm kiếm và lọc dự án theo ngôn ngữ, framework",
        "Thanh toán VNPay / MoMo",
        "Quản lý dự án và tag",
        "Dashboard admin React",
      ],
      tags: ["React", "Node.js", "Prisma", "MariaDB"],
    },
    {
      slug: "cherry-house-booking",
      title: "Cherry House - Booking Platform",
      badge: "Full-stack",
      sumary: "Nền tảng đặt phòng đa chi nhánh",
      desc: "Hệ thống Brand → Property → Branch → Room → Booking, tích hợp VNPay và MoMo.",
      longDesc:
        "<p>Cherry House quản lý booking nhiều cơ sở lưu trú với mô hình phân cấp rõ ràng.</p><p>Ví hoàn tiền xử lý race condition bằng SELECT FOR UPDATE.</p>",
      thumbnail: "https://picsum.photos/seed/cherry-house/1200/750",
      status: ProjectStatus.COMPLETED,
      isDisplay: true,
      finishedAt: new Date("2026-03-20"),
      demoUrl: "https://cherryhouse.vn",
      repoUrl: "https://github.com/kien/cherry-house",
      featured: true,
      viewCount: 856,
      features: [
        "Brand → Property → Branch → Room → Booking",
        "Tích hợp VNPay và MoMo",
        "Ví hoàn tiền an toàn",
        "Admin quản lý đa chi nhánh",
      ],
      tags: ["React", "Express", "Prisma", "Tailwind"],
    },
    {
      slug: "accessrace-checkin",
      title: "AccessRace Checkin",
      badge: "Backend",
      sumary: "Hệ thống check-in sự kiện bằng QR",
      desc: "Check-in JWT/RBAC, quét QR, gửi email SendGrid, xử lý hàng đợi BullMQ.",
      longDesc:
        "<p>Hệ thống check-in sự kiện với phân quyền JWT/RBAC và quét mã QR realtime.</p>",
      thumbnail: "https://picsum.photos/seed/accessrace/1200/750",
      status: ProjectStatus.COMPLETED,
      isDisplay: true,
      finishedAt: new Date("2025-11-10"),
      demoUrl: null,
      repoUrl: "https://github.com/kien/accessrace-checkin",
      featured: false,
      viewCount: 312,
      features: [
        "JWT + RBAC",
        "Quét QR check-in",
        "Email SendGrid",
        "Hàng đợi BullMQ",
      ],
      tags: ["Node.js", "JWT", "BullMQ", "SendGrid"],
    },
    {
      slug: "personal-portfolio",
      title: "Personal Portfolio",
      badge: "React",
      sumary: "Website portfolio cá nhân full-stack",
      desc: "React + Vite frontend, Express + Prisma backend, trang admin quản lý project và story.",
      longDesc:
        "<p>Portfolio cá nhân tích hợp blog, dự án, resume và stories.</p><p>Monorepo với admin dashboard CRUD và deploy VPS.</p>",
      thumbnail: "https://picsum.photos/seed/portfolio/1200/750",
      status: ProjectStatus.IN_PROGRESS,
      isDisplay: true,
      finishedAt: null,
      demoUrl: null,
      repoUrl: "https://github.com/kien/personal-portfolio",
      featured: true,
      viewCount: 128,
      features: [
        "Trang public catalog dự án",
        "Admin CRUD project + story",
        "JWT auth + refresh token",
        "Deploy monorepo Express + Vite",
      ],
      tags: ["React", "Vite", "Express", "Prisma"],
    },
  ];

  await prisma.projectTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();

  for (const item of projectsData) {
    const { tags, features, ...projectData } = item;
    const project = await prisma.project.create({
      data: {
        ...projectData,
        features,
      },
    });
    await linkTags(project.id, tags);
  }

  console.log(`✅ Đã tạo ${projectsData.length} projects`);

  await prisma.storyView.deleteMany();
  await prisma.story.deleteMany();

  const now = new Date();
  const inDays = (base, days) =>
    new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

  const storiesData = [
    {
      userId: admin.id,
      mediaUrl: "https://picsum.photos/seed/story-admin/900/1600",
      mediaType: MediaType.IMAGE,
      createdAt: now,
      expiresAt: inDays(now, 7),
    },
    {
      userId: admin.id,
      mediaUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "https://picsum.photos/seed/story-user1-thumb/900/1600",
      mediaType: MediaType.VIDEO,
      createdAt: now,
      expiresAt: inDays(now, 7),
    },
  ];

  for (const s of storiesData) {
    await prisma.story.create({ data: s });
  }

  console.log(`✅ Đã tạo ${storiesData.length} stories`);
  console.log("🎉 Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error("❌ Seed thất bại:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
