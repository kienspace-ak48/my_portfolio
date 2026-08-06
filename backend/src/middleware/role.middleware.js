const response = require("../utils/response.util");

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return response.fail(res, "Không có quyền truy cập", 403);
    }
    next();
  };
}

module.exports = requireRole;
