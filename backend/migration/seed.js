const { Role, MediaType } =require('../src/generated/prisma');
const prisma = require('../src/configs/prisma.config');
const bcrypt = require('bcrypt');


// prisma/seed.ts


async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // ────────────────────────────────
  // 1. USERS
  // ────────────────────────────────
  const passwordHash = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@devmarket.vn' },
    update: {},
    create: {
      name: 'Vũ Văn Kiên',
      email: 'admin@devmarket.vn',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'minh.tran@devmarket.vn' },
    update: {},
    create: {
      name: 'Trần Minh',
      email: 'minh.tran@devmarket.vn',
      password: passwordHash,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'lan.nguyen@devmarket.vn' },
    update: {},
    create: {
      name: 'Nguyễn Lan',
      email: 'lan.nguyen@devmarket.vn',
      password: passwordHash,
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'hung.pham@devmarket.vn' },
    update: {},
    create: {
      name: 'Phạm Hùng',
      email: 'hung.pham@devmarket.vn',
      password: passwordHash,
      role: Role.USER,
    },
  });

  console.log(`✅ Đã tạo ${4} users`);

  // ────────────────────────────────
  // 2. PROJECTS
  // ────────────────────────────────
  const projectsData = [
    {
      slug: 'devmarket-source-marketplace',
      title: 'DevMarket - Source Code Marketplace',
      sumary: 'Nền tảng mua bán source code cho lập trình viên',
      desc: 'Chợ source code với hệ thống thanh toán VNPay/MoMo, quản lý dự án, tag lọc.',
      longDesc:
        'DevMarket là nền tảng cho phép developer đăng bán source code, quản lý bằng Prisma + MySQL, admin dashboard xây bằng React + CoreUI.',
      thumbnail: 'https://cdn.devmarket.vn/projects/devmarket-thumb.jpg',
      isDisplay: true,
      finishedAt: new Date('2026-06-15'),
      demoUrl: 'https://devmarket.vn',
      repoUrl: 'https://github.com/kien/devmarket',
      featured: true,
      viewCount: 1240,
    },
    {
      slug: 'cherry-house-booking',
      title: 'Cherry House - Booking Platform',
      sumary: 'Nền tảng đặt phòng đa chi nhánh',
      desc: 'Hệ thống Brand → Property → Branch → Room → Booking, tích hợp VNPay và MoMo.',
      longDesc:
        'Cherry House quản lý booking nhiều cơ sở lưu trú, có ví hoàn tiền với xử lý race condition bằng SELECT FOR UPDATE.',
      thumbnail: 'https://cdn.devmarket.vn/projects/cherry-house-thumb.jpg',
      isDisplay: true,
      finishedAt: new Date('2026-03-20'),
      demoUrl: 'https://cherryhouse.vn',
      repoUrl: 'https://github.com/kien/cherry-house',
      featured: true,
      viewCount: 856,
    },
    {
      slug: 'accessrace-checkin',
      title: 'AccessRace Checkin',
      sumary: 'Hệ thống check-in sự kiện bằng QR',
      desc: 'Check-in JWT/RBAC, quét QR, gửi email SendGrid, xử lý hàng đợi BullMQ.',
      longDesc: null,
      thumbnail: 'https://cdn.devmarket.vn/projects/accessrace-thumb.jpg',
      isDisplay: true,
      finishedAt: new Date('2025-11-10'),
      demoUrl: null,
      repoUrl: 'https://github.com/kien/accessrace-checkin',
      featured: false,
      viewCount: 312,
    },
    {
      slug: 'toppicare-cms',
      title: 'Toppicare - No-code CMS',
      sumary: 'React SPA kèm admin panel no-code',
      desc: 'Hệ thống quản trị nội dung không cần code, bảo vệ bằng Cloudflare Turnstile.',
      longDesc: null,
      thumbnail: null,
      isDisplay: false,
      finishedAt: null,
      demoUrl: null,
      repoUrl: 'https://github.com/kien/toppicare',
      featured: false,
      viewCount: 50,
    },
  ];

  for (const p of projectsData) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log(`✅ Đã tạo ${projectsData.length} projects`);

  // ────────────────────────────────
  // 3. STORIES
  // ────────────────────────────────
  const now = new Date();
  const in24h = (base) => new Date(base.getTime() + 24 * 60 * 60 * 1000);

  const storiesData = [
    {
      userId: admin.id,
      mediaUrl: 'https://cdn.devmarket.vn/stories/admin_photo1.jpg',
      mediaType: MediaType.IMAGE,
      createdAt: now,
      expiresAt: in24h(now),
    },
    {
      userId: user1.id,
      mediaUrl: 'https://cdn.devmarket.vn/stories/user1_video1.mp4',
      mediaType: MediaType.VIDEO,
      createdAt: now,
      expiresAt: in24h(now),
    },
    {
      userId: user2.id,
      mediaUrl: 'https://cdn.devmarket.vn/stories/user2_photo1.jpg',
      mediaType: MediaType.IMAGE,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3h trước
      expiresAt: in24h(new Date(now.getTime() - 3 * 60 * 60 * 1000)),
    },
    {
      // story đã hết hạn, để test filter query
      userId: user3.id,
      mediaUrl: 'https://cdn.devmarket.vn/stories/user3_photo1.jpg',
      mediaType: MediaType.IMAGE,
      createdAt: new Date(now.getTime() - 25 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
  ];

  const createdStories = [];
  for (const s of storiesData) {
    const story = await prisma.story.create({ data: s });
    createdStories.push(story);
  }

  console.log(`✅ Đã tạo ${createdStories.length} stories`);

  // ────────────────────────────────
  // 4. STORY VIEWS
  // ────────────────────────────────
  // Lưu ý: viewerId không có relation tới User trong schema,
  // nên ở đây chỉ seed dạng string id giả lập (ví dụ userId dạng string).
  const storyViewsData = [
    { storyId: createdStories[0].id, viewerId: String(user1.id) },
    { storyId: createdStories[0].id, viewerId: String(user2.id) },
    { storyId: createdStories[1].id, viewerId: String(admin.id) },
    { storyId: createdStories[1].id, viewerId: String(user3.id) },
    { storyId: createdStories[2].id, viewerId: String(user1.id) },
  ];

  for (const v of storyViewsData) {
    await prisma.storyView.upsert({
      where: {
        storyId_viewerId: {
          storyId: v.storyId,
          viewerId: v.viewerId,
        },
      },
      update: {},
      create: v,
    });
  }

  console.log(`✅ Đã tạo ${storyViewsData.length} story views`);

  console.log('🎉 Seed hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
