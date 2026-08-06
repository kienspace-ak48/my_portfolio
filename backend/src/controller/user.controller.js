const CNAME = "user.controller.js ";
const userRepo = require("../repositories/user.repository");
const response = require("../utils/response.util");

function toSafeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function userController() {
  return {
    Index: async (req, res) => {
      try {
        const users = await userRepo.findAll();
        return response.success(res, users.map(toSafeUser));
      } catch (error) {
        console.log(CNAME + error.message);
        return response.fail(res);
      }
    },
  };
}

module.exports = userController;
