const http = require('http');
const app = require('./src/app');
const dotenv = require('dotenv');
const {ENV_PATH} = require('./src/configs/myPath.config');
dotenv.config({
  path: ENV_PATH
});

const HTTP_PORT = process.env.HTTP_PORT || 3000;

const httpServer = http.createServer(app);
function startServer() {
  console.log("Node Environment:", process.env.NODE_ENV);
  httpServer.listen(HTTP_PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${HTTP_PORT}`);
  });
}
startServer();
