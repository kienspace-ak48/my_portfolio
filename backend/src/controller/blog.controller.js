const blogRepository = require("../repositories/blog.repository");
const response = require("../utils/response.util");

const CANME = "blog.controller.js ";

function parseBlogBody(body) {
  const data = { ...body };

  if (data.publishedAt === "" || data.publishedAt === null) {
    data.publishedAt = null;
  }

  if (typeof data.readMinutes === "string") {
    data.readMinutes = Number(data.readMinutes);
  }

  if (typeof data.viewCount === "string") {
    data.viewCount = Number(data.viewCount);
  }

  if (typeof data.isDisplay === "string") {
    data.isDisplay = data.isDisplay === "true";
  }

  if (typeof data.featured === "string") {
    data.featured = data.featured === "true";
  }

  if (data.featuredOrder !== undefined) {
    data.featuredOrder = Number(data.featuredOrder) || 0;
  }

  if (data.featured === false) {
    data.featuredOrder = 0;
  }

  return data;
}

function blogController() {
  return {
    Index: async (req, res) => {
      try {
        const posts = await blogRepository.findPublic(req.query);
        return response.success(res, posts);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(
          res,
          process.env.NODE_ENV === "production"
            ? "Không thể tải danh sách bài viết"
            : error.message,
          500,
        );
      }
    },

    AdminIndex: async (req, res) => {
      try {
        const posts = await blogRepository.findAllAdmin();
        return response.success(res, posts);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(
          res,
          process.env.NODE_ENV === "production"
            ? "Không thể tải danh sách bài viết"
            : error.message,
          500,
        );
      }
    },

    Tags: async (_req, res) => {
      try {
        const tags = await blogRepository.findTagStats();
        return response.success(res, tags);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(res, error.message, 500);
      }
    },

    ShowBySlug: async (req, res) => {
      try {
        const post = await blogRepository.findBySlug(req.params.slug, {
          incrementView: true,
        });

        if (!post || !post.isDisplay || post.status !== "PUBLISHED") {
          return response.fail(res, "Không tìm thấy bài viết", 404);
        }

        return response.success(res, post);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(res, error.message, 500);
      }
    },

    Show: async (req, res) => {
      try {
        const post = await blogRepository.findById(req.params.id);
        if (!post) {
          return response.fail(res, "Không tìm thấy bài viết", 404);
        }
        return response.success(res, post);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(res, error.message, 500);
      }
    },

    Add: async (req, res) => {
      try {
        const data = parseBlogBody(req.body);

        if (!data.title?.trim() || !data.slug?.trim()) {
          return response.fail(res, "Tiêu đề và slug là bắt buộc", 400);
        }

        if (!data.excerpt?.trim()) {
          return response.fail(res, "Mô tả ngắn (excerpt) là bắt buộc", 400);
        }

        if (data.status === "PUBLISHED" && !data.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }

        const authorId = req.user?.id;
        if (!authorId) {
          return response.fail(res, "Không xác định được tác giả", 401);
        }

        const post = await blogRepository.create(data, authorId);
        return response.success(res, post, "Tạo bài viết thành công", 201);
      } catch (error) {
        console.error(CANME, error);
        if (error.code === "P2002") {
          return response.fail(res, "Slug đã tồn tại", 409);
        }
        return response.fail(res, error.message, 500);
      }
    },

    Update: async (req, res) => {
      try {
        const data = parseBlogBody(req.body);

        if (data.status === "PUBLISHED" && !data.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }

        const post = await blogRepository.update(req.params.id, data);
        return response.success(res, post, "Cập nhật bài viết thành công");
      } catch (error) {
        console.error(CANME, error);
        if (error.code === "P2002") {
          return response.fail(res, "Slug đã tồn tại", 409);
        }
        if (error.code === "P2025") {
          return response.fail(res, "Không tìm thấy bài viết", 404);
        }
        return response.fail(res, error.message, 500);
      }
    },

    Remove: async (req, res) => {
      try {
        await blogRepository.remove(req.params.id);
        return response.success(res, null, "Xóa bài viết thành công");
      } catch (error) {
        console.error(CANME, error);
        if (error.code === "P2025") {
          return response.fail(res, "Không tìm thấy bài viết", 404);
        }
        return response.fail(res, error.message, 500);
      }
    },
  };
}

module.exports = blogController;
