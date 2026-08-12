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
router.get("/robots.txt", seoController.robots);
router.get("/sitemap.xml", seoController.sitemap);
router.get("/api/admin/seo", ...admin, adminSeoController.show);
router.put("/api/admin/seo/global", ...admin, adminSeoController.updateGlobal);
router.put("/api/admin/seo/pages/:pageKey", ...admin, adminSeoController.updatePage);

// [resume]
router.get("/api/resume", resumeController.getPublic);
router.get("/api/admin/resume", ...admin, resumeController.getAdmin);
router.put("/api/admin/resume", ...admin, resumeController.update);
router.post(
  "/api/admin/resume/cv",
  ...admin,
  upload.single("cv"),
  resumeController.uploadCv,
);
router.delete("/api/admin/resume/cv", ...admin, resumeController.removeCv);

module.exports = router;
