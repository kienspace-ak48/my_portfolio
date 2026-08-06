const router = require("express").Router();
const authController = require("./auth.controller")();
const authenticateToken = require("../middleware/auth.middleware");

router.post("/login", authController.Login);
router.post("/refresh", authController.Refresh);
router.post("/logout", authController.Logout);
router.get("/me", authenticateToken, authController.Me);

module.exports = router;
