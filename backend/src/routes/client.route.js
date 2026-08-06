const express = require("express");
const router = express.Router();

const StoryController = require("../controller/story.controller")();
const projectController = require("../controller/project.controller")();
const userController = require("../controller/user.controller")();
const upload = require("../configs/multer.config");
const authenticateToken = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");

const admin = [authenticateToken, requireRole("ADMIN")];

// [projects]
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

// [users]
router.get("/api/users", ...admin, userController.Index);

module.exports = router;
