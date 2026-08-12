const prisma = require("../configs/prisma.config");

const resumeRepository = {
  find() {
    return prisma.resumeSettings.findUnique({ where: { id: 1 } });
  },

  upsert(data) {
    return prisma.resumeSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
  },
};

module.exports = resumeRepository;
