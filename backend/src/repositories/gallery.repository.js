const BaseRepository = require("./base.repository");
const prisma = require("../configs/prisma.config");

class GalleryRepository extends BaseRepository {
  constructor() {
    super(prisma.galleryAsset);
  }

  findAllPublic() {
    return prisma.galleryAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  findAllAdmin() {
    return prisma.galleryAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new GalleryRepository();
