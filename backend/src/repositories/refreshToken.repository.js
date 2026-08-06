const prisma = require("../configs/prisma.config");

async function create({ token, userId, expiresAt }) {
  return prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
}

async function findByToken(token) {
  return prisma.refreshToken.findUnique({
    where: { token },
  });
}

async function removeByToken(token) {
  return prisma.refreshToken.deleteMany({
    where: { token },
  });
}

async function removeByUserId(userId) {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

module.exports = {
  create,
  findByToken,
  removeByToken,
  removeByUserId,
};
