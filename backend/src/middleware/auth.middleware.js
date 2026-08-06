const jwt = require("../utils/jwt.util");
const response = require("../utils/response.util");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return response.fail(res, "Không có token", 401);
  }

  try {
    req.user = jwt.verifyAccessToken(token);
    next();
  } catch {
    return response.fail(res, "Token không hợp lệ hoặc hết hạn", 403);
  }
}

module.exports = authenticateToken;
