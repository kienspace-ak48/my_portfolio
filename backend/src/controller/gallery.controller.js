const CNAME = "gallery.controller.js";
const galleryRepo = require("../repositories/gallery.repository.js");
const response = require("../utils/response.util");
const cloudinary = require("../configs/cloudinary.config.js");

function detectMediaType(file, bodyType) {
  if (bodyType === "IMAGE" || bodyType === "VIDEO") return bodyType;
  if (file.mimetype.startsWith("video/")) return "VIDEO";
  return "IMAGE";
}

function uploadToCloudinary(buffer, mediaType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: mediaType === "VIDEO" ? "video" : "image",
        folder: "gallery",
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

function videoThumbnailUrl(secureUrl) {
  return secureUrl.replace(/\.(mp4|mov|webm|avi|mkv)(\?.*)?$/i, ".jpg");
}

const GalleryController = () => ({
  Index: async (req, res) => {
    try {
      const list = await galleryRepo.findAllPublic();
      response.success(res, list);
    } catch (error) {
      console.error(CNAME, error);
      response.fail(
        res,
        process.env.NODE_ENV === "production"
          ? "Không thể tải gallery"
          : error.message,
        500,
      );
    }
  },

  AdminIndex: async (req, res) => {
    try {
      const list = await galleryRepo.findAllAdmin();
      response.success(res, list);
    } catch (error) {
      console.error(CNAME, error);
      response.fail(res);
    }
  },

  Add: async (req, res) => {
    try {
      if (!req.file) {
        return response.fail(res, "Thiếu file media", 400);
      }

      const mediaType = detectMediaType(req.file, req.body.mediaType);
      const uploadResult = await uploadToCloudinary(req.file.buffer, mediaType);

      const data = {
        title: req.body.title?.trim() || req.file.originalname,
        alt: req.body.alt?.trim() || null,
        mediaUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        thumbnailUrl:
          mediaType === "VIDEO"
            ? videoThumbnailUrl(uploadResult.secure_url)
            : uploadResult.secure_url,
        mediaType,
        folder: req.body.folder?.trim() || null,
        fileSize: uploadResult.bytes ?? null,
        width: uploadResult.width ?? null,
        height: uploadResult.height ?? null,
      };

      const asset = await galleryRepo.create(data);
      response.success(res, asset, null, 201);
    } catch (error) {
      console.error(CNAME, error);
      response.fail(
        res,
        process.env.NODE_ENV === "production"
          ? "Không thể upload media"
          : error.message,
        500,
      );
    }
  },

  Update: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await galleryRepo.findById(id);
      if (!existing) {
        return response.fail(res, "Không tìm thấy media", 404);
      }

      const data = {};
      if (req.body.title !== undefined) data.title = req.body.title?.trim() || null;
      if (req.body.alt !== undefined) data.alt = req.body.alt?.trim() || null;
      if (req.body.folder !== undefined) data.folder = req.body.folder?.trim() || null;

      const asset = await galleryRepo.update(id, data);
      response.success(res, asset);
    } catch (error) {
      console.error(CNAME, error);
      response.fail(res);
    }
  },

  Remove: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await galleryRepo.findById(id);
      if (!existing) {
        return response.fail(res, "Không tìm thấy media", 404);
      }

      if (existing.publicId) {
        try {
          await cloudinary.uploader.destroy(existing.publicId, {
            resource_type: existing.mediaType === "VIDEO" ? "video" : "image",
          });
        } catch (cloudErr) {
          console.warn(CNAME, "Cloudinary delete:", cloudErr.message);
        }
      }

      await galleryRepo.remove(id);
      response.success(res, null, "Xóa media thành công");
    } catch (error) {
      console.error(CNAME, error);
      response.fail(res);
    }
  },
});

module.exports = GalleryController;
