const RICH_HTML = `
<h2 id="van-de">Vấn đề / bối cảnh</h2>
<p>Case sensitivity trên Linux khiến migration Prisma pass trên Windows nhưng fail trên VPS — đặc biệt với <code>@@map</code> và tên bảng snake_case.</p>
<h2 id="giai-phap">Giải pháp</h2>
<p>Quy ước thống nhất trong team:</p>
<ul>
  <li>Bảng: <code>snake_case</code> qua <code>@@map</code></li>
  <li>Cột: <code>snake_case</code> qua <code>@map</code></li>
  <li>Không mix PascalCase trong MariaDB production</li>
</ul>
<blockquote><p>«Migration phải chạy được trên MariaDB Linux trước khi merge.»</p></blockquote>
<h2 id="code-mau">Code mẫu</h2>
<pre><code>model Project {
  longDesc String? @map("long_desc") @db.Text
  @@map("project")
}</code></pre>
<h2 id="ket-luan">Kết luận</h2>
<p>Test migration trên Docker MariaDB Linux trong CI — tránh surprise khi deploy.</p>
`.trim();

const TUTORIAL_HTML = `
<h2 id="tich-hop">Tích hợp TinyMCE</h2>
<p>Editor dùng nút <strong>Gallery</strong> để chèn ảnh từ thư viện Cloudinary.</p>
<h2 id="cover">Ảnh cover vs inline</h2>
<p>Cover chọn qua Gallery picker ở sidebar form; ảnh trong bài chèn trực tiếp từ toolbar editor.</p>
<h3 id="luu-y">Lưu ý</h3>
<p>Luôn dùng HTTPS URL — email client và SEO đều cần absolute URL.</p>
`.trim();

const MINIMAL_HTML = `<p>Bài viết ngắn gọn — case test excerpt + content tối thiểu, không có h2 (mục lục trống).</p>`;

/**
 * Demo blog posts — mỗi slug = một test case UI/API.
 * Chạy seed sẽ upsert theo slug (an toàn chạy lại).
 */
const BLOG_SEED_POSTS = [
  {
    slug: "demo-featured-backend-prisma",
    title: "[DEMO] Featured · Backend · Prisma trên MariaDB Linux",
    excerpt:
      "Case: featured + published + hiển thị + cover + HTML đầy đủ + nhiều view + tags.",
    content: RICH_HTML,
    coverUrl: "https://picsum.photos/seed/blog-featured-prisma/1200/630",
    categorySlug: "backend",
    status: "PUBLISHED",
    isDisplay: true,
    featured: true,
    featuredOrder: 0,
    readMinutes: 8,
    viewCount: 420,
    tags: ["Prisma", "MariaDB", "DevOps", "Demo"],
    publishedAt: "2026-08-10T08:00:00.000Z",
  },
  {
    slug: "demo-frontend-react-19",
    title: "[DEMO] Frontend · React 19 patterns thực tế",
    excerpt: "Case: published, category frontend, không featured.",
    content: `<h2 id="hooks">Hooks &amp; composition</h2><p>Bài test category <strong>frontend</strong> và related posts.</p>`,
    coverUrl: "https://picsum.photos/seed/blog-react19/1200/630",
    categorySlug: "frontend",
    status: "PUBLISHED",
    isDisplay: true,
    featured: false,
    readMinutes: 5,
    viewCount: 180,
    tags: ["React", "TypeScript", "Demo"],
    publishedAt: "2026-08-08T10:00:00.000Z",
  },
  {
    slug: "demo-devops-nginx-pm2",
    title: "[DEMO] DevOps · Deploy Node.js + Nginx + PM2",
    excerpt: "Case: sort popular — viewCount cao.",
    content: `<h2 id="deploy">Quy trình deploy</h2><p>Test sort <em>popular</em> trên trang /blog.</p>`,
    coverUrl: "https://picsum.photos/seed/blog-devops/1200/630",
    categorySlug: "devops",
    status: "PUBLISHED",
    isDisplay: true,
    featured: true,
    featuredOrder: 1,
    readMinutes: 7,
    viewCount: 980,
    tags: ["Nginx", "PM2", "VPS", "Demo"],
    publishedAt: "2026-08-07T14:00:00.000Z",
  },
  {
    slug: "demo-career-junior-to-mid",
    title: "[DEMO] Career · Từ Junior lên Mid sau 3 năm",
    excerpt: "Case: category career, bài thường.",
    content: `<h2 id="lo-trinh">Lộ trình</h2><p>Category <strong>career</strong> cho filter pill.</p>`,
    coverUrl: "https://picsum.photos/seed/blog-career/1200/630",
    categorySlug: "career",
    status: "PUBLISHED",
    isDisplay: true,
    featured: false,
    readMinutes: 6,
    viewCount: 95,
    tags: ["Career", "Demo"],
    publishedAt: "2026-08-06T09:00:00.000Z",
  },
  {
    slug: "demo-tutorial-tinymce-gallery",
    title: "[DEMO] Tutorial · TinyMCE + Gallery picker",
    excerpt: "Case: tutorial + nhiều h2 cho mục lục (TOC).",
    content: TUTORIAL_HTML,
    coverUrl: "https://picsum.photos/seed/blog-tutorial/1200/630",
    categorySlug: "tutorial",
    status: "PUBLISHED",
    isDisplay: true,
    featured: false,
    readMinutes: 4,
    viewCount: 120,
    tags: ["TinyMCE", "Gallery", "Admin", "Demo"],
    publishedAt: "2026-08-05T11:00:00.000Z",
  },
  {
    slug: "demo-draft-khong-public",
    title: "[DEMO] Nháp · Không hiện public",
    excerpt: "Case: status DRAFT — không xuất hiện GET /api/blog.",
    content: MINIMAL_HTML,
    coverUrl: "https://picsum.photos/seed/blog-draft/1200/630",
    categorySlug: "backend",
    status: "DRAFT",
    isDisplay: false,
    featured: false,
    readMinutes: 2,
    viewCount: 0,
    tags: ["Draft", "Demo"],
    publishedAt: null,
  },
  {
    slug: "demo-archived-luu-tru",
    title: "[DEMO] Lưu trữ · ARCHIVED",
    excerpt: "Case: status ARCHIVED — admin thấy, public không.",
    content: `<p>Bài đã lưu trữ.</p>`,
    coverUrl: "https://picsum.photos/seed/blog-archived/1200/630",
    categorySlug: "frontend",
    status: "ARCHIVED",
    isDisplay: false,
    featured: false,
    readMinutes: 3,
    viewCount: 12,
    tags: ["Archived", "Demo"],
    publishedAt: "2026-01-15T08:00:00.000Z",
  },
  {
    slug: "demo-an-cong-khai",
    title: "[DEMO] Published nhưng ẩn (isDisplay=false)",
    excerpt: "Case: PUBLISHED + isDisplay false — slug 404 public.",
    content: `<p>Chỉ admin list thấy bài này.</p>`,
    coverUrl: "https://picsum.photos/seed/blog-hidden/1200/630",
    categorySlug: "devops",
    status: "PUBLISHED",
    isDisplay: false,
    featured: false,
    readMinutes: 2,
    viewCount: 5,
    tags: ["Hidden", "Demo"],
    publishedAt: "2026-08-04T08:00:00.000Z",
  },
  {
    slug: "demo-khong-anh-cover",
    title: "[DEMO] Không có ảnh cover",
    excerpt: "Case: published không coverUrl — header fallback không hero image.",
    content: `<h2 id="no-cover">Không cover</h2><p>Test layout khi thiếu ảnh đại diện.</p>`,
    coverUrl: null,
    categorySlug: "tutorial",
    status: "PUBLISHED",
    isDisplay: true,
    featured: false,
    readMinutes: 3,
    viewCount: 44,
    tags: ["NoCover", "Demo"],
    publishedAt: "2026-08-03T08:00:00.000Z",
  },
  {
    slug: "demo-nhieu-tag-loc",
    title: "[DEMO] Nhiều tag · test filter ?tag=",
    excerpt: "Case: nhiều tag — sidebar + ?tag= filter.",
    content: `<p>Dùng tag <strong>FilterMe</strong> trên URL /blog?tag=FilterMe</p>`,
    coverUrl: "https://picsum.photos/seed/blog-tags/1200/630",
    categorySlug: "backend",
    status: "PUBLISHED",
    isDisplay: true,
    featured: false,
    readMinutes: 4,
    viewCount: 67,
    tags: ["FilterMe", "Prisma", "React", "Node.js", "Demo", "TagTest"],
    publishedAt: "2026-08-02T08:00:00.000Z",
  },
  {
    slug: "demo-cap-nhat-sau-dang",
    title: "[DEMO] Bài có ngày cập nhật",
    excerpt: "Case: updatedAt khác publishedAt trên trang chi tiết.",
    content: `<h2 id="update">Cập nhật nội dung</h2><p>Hiển thị dòng «Cập nhật …» dưới ngày đăng.</p>`,
    coverUrl: "https://picsum.photos/seed/blog-updated/1200/630",
    categorySlug: "frontend",
    status: "PUBLISHED",
    isDisplay: true,
    featured: false,
    readMinutes: 5,
    viewCount: 210,
    tags: ["Updated", "Demo"],
    publishedAt: "2026-07-20T08:00:00.000Z",
    updatedAt: "2026-08-12T16:30:00.000Z",
  },
];

module.exports = { BLOG_SEED_POSTS };
