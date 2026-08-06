const dotenv = require('dotenv');
const {ENV_PATH} = require('./src/configs/myPath.config');
dotenv.config({
  path: ENV_PATH
});

const http = require('http');
const app = require('./src/app');

const prisma = require('./src/configs/prisma.config');


const HTTP_PORT = process.env.HTTP_PORT || 3000;

const httpServer = http.createServer(app);
// check DB
async function checkDataBaseConnection(){
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('🟢 MySQL connected');
  } catch (error) {
    console.log('🔴 MySQL failed: ',error);
  }
}

async function readData(){
  const data = await prisma.user.findMany();
  console.log(data);
}

function startServer() {
  console.log("[Node Environment] :", process.env.NODE_ENV);
  httpServer.listen(HTTP_PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${HTTP_PORT}`);
  });
  checkDataBaseConnection();
  // insertData();
  // readData();
}
startServer();

// flow: route -> controller -> service -> repository(prisma) -> MySQL 
