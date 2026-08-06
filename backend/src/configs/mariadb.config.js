const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

/** Parse DATABASE_URL thành object options cho MariaDB driver adapter (v7.x). */
function parseMariaDbUrl(connectionString) {
  if (!connectionString) return null;

  const url = new URL(connectionString.replace(/^mysql:\/\//, 'mariadb://'));

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    connectTimeout: 10000,
    acquireTimeout: 10000,
    allowPublicKeyRetrieval: true,
  };
}

function createMariaDbAdapter(connectionString = process.env.DATABASE_URL) {
  const options = parseMariaDbUrl(connectionString);
  return new PrismaMariaDb(options);
}

module.exports = {
  parseMariaDbUrl,
  createMariaDbAdapter,
};