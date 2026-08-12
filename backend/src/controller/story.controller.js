const CNAME = "story.controller.js ";
const storyRepo = require("../repositories/story.repository.js");
const response = require("../utils/response.util");
const cloudinary = require("../configs/cloudinary.config.js");

function parseBoolean(value) {
  return value === true || value === "true" || value === "1";
}

function videoThumbnailUrl(secureUrl) {
  return secureUrl.replace(/\.(mp4|mov|webm|avi|mkv)(\?.*)?$/i, ".jpg");
}

const StoryController = () => {
  return {
    Index: async (req, res) => {
      try {
        const list = await storyRepo.findAll2();
        response.success(res, list);
      } catch (error) {
        console.error(CNAME, error);
        response.fail(
          res,
          process.env.NODE_ENV === "production"
            ? "Không thể tải stories"
            : error.message,
          500,
        );
      }
    },
    AdminIndex: async (req, res) => {
      try {
        const list = await storyRepo.findAllAdmin();
        response.success(res, list);
      } catch (error) {
        console.log(CNAME + error.message);
        response.fail(res);
      }
    },
    Add: async (req, res) => {
      try {
        const { userId, mediaType, mediaUrl, thumbnailUrl } = req.body;
        const isPinned = parseBoolean(req.body.isPinned);
        const type = mediaType === "VIDEO" ? "VIDEO" : "IMAGE";

        let resolvedMediaUrl = mediaUrl?.trim() || "";
        let resolvedThumbnailUrl = thumbnailUrl?.trim() || null;

        if (!resolvedMediaUrl) {
          if (!req.file) {
            return response.fail(res, "Thiếu file media hoặc mediaUrl từ gallery", 400);
          }

          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                resource_type: type === "VIDEO" ? "video" : "image",
                folder: "stories",
              },
              (err, result) => (err ? reject(err) : resolve(result)),
            );
            stream.end(req.file.buffer);
          });

          resolvedMediaUrl = uploadResult.secure_url;
          resolvedThumbnailUrl =
            type === "VIDEO" ? videoThumbnailUrl(uploadResult.secure_url) : null;
        } else if (type === "VIDEO" && !resolvedThumbnailUrl) {
          resolvedThumbnailUrl = videoThumbnailUrl(resolvedMediaUrl);
        }

        const now = new Date();
        const data = {
          userId: Number(userId || req.user?.id),
          mediaUrl: resolvedMediaUrl,
          thumbnailUrl: resolvedThumbnailUrl,
          mediaType: type,
          isPinned,
          expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        };

        const story = await storyRepo.create(data);
        response.success(res, story, null, 201);
      } catch (error) {
        console.log(CNAME, error.message);
        response.fail(res, error.message, 500);
      }
    },
    Delete: async (req, res) => {
      try {
        const { id } = req.params;
        await storyRepo.remove(id);
        response.success(res, null, "Xóa story thành công");
      } catch (error) {
        console.log(CNAME + error.message);
        response.fail(res);
      }
    },
    UpdatePin: async (req, res) => {
      try {
        const { id } = req.params;
        const isPinned = parseBoolean(req.body.isPinned);
        const story = await storyRepo.update(id, { isPinned });
        response.success(res, story, isPinned ? "Đã ghim story" : "Đã bỏ ghim story");
      } catch (error) {
        console.log(CNAME + error.message);
        response.fail(res, error.message, 500);
      }
    },
  };
};

module.exports = StoryController;
