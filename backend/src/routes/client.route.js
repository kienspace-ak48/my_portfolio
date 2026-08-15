const express = require("express");
const router = express.Router();

const StoryController = require("../controller/story.controller")();
const projectController = require("../controller/project.controller")();
const galleryController = require("../controller/gallery.controller")();
const userController = require("../controller/user.controller")();
const metaCrawlController = require("../controller/meta-crawl.controller")();
const seoController = require("../controller/seo.controller");
const adminSeoController = require("../controller/adminSeo.controller");
const resumeController = require("../controller/resume.controller");
const blogController = require("../controller/blog.controller")();
const backupController = require("../controller/backup.controller");
const taxonomyController = require("../controller/taxonomy.controller");
const upload = require("../configs/multer.config");
const authenticateToken = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");

const admin = [authenticateToken, requireRole("ADMIN")];

// [projects]
router.get("/api/projects/admin", ...admin, projectController.AdminIndex);
router.get("/api/projects/tags", projectController.Tags);
router.get("/api/projects/slug/:slug", projectController.ShowBySlug);
router.get("/api/projects", projectController.Index);
router.get("/api/projects/:id", projectController.Show);
router.post("/api/projects", ...admin, projectController.Add);
router.put("/api/projects/:id", ...admin, projectController.Update);
router.delete("/api/projects/:id", ...admin, projectController.Remove);

// [stories]
router.get("/api/stories", StoryController.Index);
router.get("/api/stories/admin", ...admin, StoryController.AdminIndex);
router.post(
  "/api/stories",
  ...admin,
  upload.single("media"),
  StoryController.Add,
);
router.delete("/api/stories/:id", ...admin, StoryController.Delete);
router.patch("/api/stories/:id/pin", ...admin, StoryController.UpdatePin);

// [gallery] — Cloudinary upload + DB path storage
router.get("/api/gallery", galleryController.Index);
router.get("/api/gallery/admin", ...admin, galleryController.AdminIndex);
router.post(
  "/api/gallery",
  ...admin,
  upload.single("media"),
  galleryController.Add,
);
router.put("/api/gallery/:id", ...admin, galleryController.Update);
router.delete("/api/gallery/:id", ...admin, galleryController.Remove);

// [users]
router.get("/api/users", ...admin, userController.Index);

// [tools] — public meta crawl proxy (SSR fetch)
router.get("/api/tools/meta-crawl", metaCrawlController.Crawl);

// [seo]
router.get("/api/seo/config", seoController.getConfig);
router.get("/api/admin/seo", ...admin, adminSeoController.show);
router.put("/api/admin/seo/global", ...admin, adminSeoController.updateGlobal);
router.put("/api/admin/seo/pages/:pageKey", ...admin, adminSeoController.updatePage);

// [resume]
router.get("/api/resume", resumeController.getPublic);
router.get("/api/resume/cv/download", resumeController.downloadCv);
router.get("/api/admin/resume", ...admin, resumeController.getAdmin);
router.put("/api/admin/resume", ...admin, resumeController.update);
router.post(
  "/api/admin/resume/cv",
  ...admin,
  upload.single("cv"),
  resumeController.uploadCv,
);
router.delete("/api/admin/resume/cv", ...admin, resumeController.removeCv);

// [blog]
router.get("/api/blog/admin", ...admin, blogController.AdminIndex);
router.get("/api/blog/categories", taxonomyController.ListCategoriesPublic);
router.get("/api/blog/tags", blogController.Tags);
router.get("/api/blog/slug/:slug", blogController.ShowBySlug);
router.get("/api/blog", blogController.Index);
router.get("/api/blog/:id", ...admin, blogController.Show);
router.post("/api/blog", ...admin, blogController.Add);
router.put("/api/blog/:id", ...admin, blogController.Update);
router.delete("/api/blog/:id", ...admin, blogController.Remove);

// [backup & seed demo]
router.get("/api/admin/backup/stats", ...admin, backupController.Stats);
router.get("/api/admin/backup/export", ...admin, backupController.ExportDownload);
router.post("/api/admin/backup/save", ...admin, backupController.ExportSave);
router.get("/api/admin/backup/files/:filename", ...admin, backupController.DownloadSaved);
router.post("/api/admin/backup/seed-blog-demo", ...admin, backupController.SeedBlogDemo);

// [taxonomy — tags & blog categories]
router.get("/api/admin/tags", ...admin, taxonomyController.ListTags);
router.post("/api/admin/tags", ...admin, taxonomyController.CreateTag);
router.put("/api/admin/tags/:id", ...admin, taxonomyController.UpdateTag);
router.delete("/api/admin/tags/:id", ...admin, taxonomyController.RemoveTag);
router.get("/api/admin/blog/categories", ...admin, taxonomyController.ListCategoriesAdmin);
router.post("/api/admin/blog/categories", ...admin, taxonomyController.CreateCategory);
router.put("/api/admin/blog/categories/:id", ...admin, taxonomyController.UpdateCategory);
router.delete("/api/admin/blog/categories/:id", ...admin, taxonomyController.RemoveCategory);

module.exports = router;
