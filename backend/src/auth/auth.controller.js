const CNAME = "auth.controller.js ";
const authService = require("./auth.service");
const response = require("../utils/response.util");

function authController() {
  return {
    Login: async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return response.fail(res, "Email và mật khẩu là bắt buộc", 400);
        }

        const result = await authService.login(email, password);
        return response.success(res, result, "Đăng nhập thành công");
      } catch (error) {
        console.log(CNAME + error.message);
        if (error.message === "INVALID_CREDENTIALS") {
          return response.fail(res, "Sai email hoặc mật khẩu", 401);
        }
        return response.fail(res, "Đăng nhập thất bại", 500);
      }
    },

    Refresh: async (req, res) => {
      try {
        const { refreshToken } = req.body;
        const result = await authService.refresh(refreshToken);
        return response.success(res, result, "Làm mới token thành công");
      } catch (error) {
        console.log(CNAME + error.message);
        if (
          error.message === "MISSING_REFRESH_TOKEN" ||
          error.message === "INVALID_REFRESH_TOKEN"
        ) {
          return response.fail(res, "Refresh token không hợp lệ", 403);
        }
        return response.fail(res, "Làm mới token thất bại", 500);
      }
    },

    Logout: async (req, res) => {
      try {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        return response.success(res, null, "Đăng xuất thành công");
      } catch (error) {
        console.log(CNAME + error.message);
        return response.fail(res, "Đăng xuất thất bại", 500);
      }
    },

    Me: async (req, res) => {
      try {
        const profile = await authService.getProfile(req.user.id);
        return response.success(res, profile);
      } catch (error) {
        console.log(CNAME + error.message);
        if (error.message === "USER_NOT_FOUND") {
          return response.fail(res, "Không tìm thấy người dùng", 404);
        }
        return response.fail(res, "Lấy thông tin thất bại", 500);
      }
    },
  };
}

module.exports = authController;
