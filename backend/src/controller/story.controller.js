const CNAME = "story.controller.js ";
const storyRepo = require("../repositories/story.repository.js");
const response = require("../utils/response.util");
const cloudinary = require("../configs/cloudinary.config.js");

const StoryController = () => {
  return {
    Index: async (req, res) => {
      try {
        const list = await storyRepo.findAll2();
        response.success(res, list);
      } catch (error) {
        console.log(CNAME + error.message);
        response.fail(res);
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
        const { userId, mediaType } = req.body;
        if (!req.file) {
          return response.fail(res, "Thieu file media", 400);
        }
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: mediaType === "VIDEO" ? "video" : "image",
              folder: "stories",
            },
            (err, result) => (err ? reject(err) : resolve(result)),
          );
          stream.end(req.file.buffer);
        });
        const thumbnailUrl =
          mediaType === "VIDEO"
            ? uploadResult.secure_url.replace(/\.(mp4|mov|webm)$/, ".jpg")
            : null;
        const now = new Date();
        const data = {
          userId: Number(userId || req.user?.id),
          mediaUrl: uploadResult.secure_url,
          thumbnailUrl,
          mediaType,
          expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        };
        const story = await storyRepo.create(data);
        response.success(res, story, null, 201);
      } catch (error) {
        console.log(CNAME, error.message);
        response.fail(res);
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
  };
};

module.exports = StoryController;
