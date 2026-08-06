const clientRouter = require("./client.route");
const authRouter = require("../auth/auth.route");

function registerRoute(app) {
  app.use("/api/auth", authRouter);
  app.use("/", clientRouter);
}

module.exports = registerRoute;
