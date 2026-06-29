import http from "http";
import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
import app from "./src/app.js";
const HTTP_PORT = process.env.HTTP_PORT || 3000;

const httpServer = http.createServer(app);
function startServer() {
  console.log("Node Environment:", process.env.NODE_ENV);
  httpServer.listen(HTTP_PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${HTTP_PORT}`);
  });
}
startServer();
