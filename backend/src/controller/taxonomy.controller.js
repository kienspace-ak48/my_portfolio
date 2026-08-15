const tagRepository = require("../repositories/tag.repository");
const blogCategoryRepository = require("../repositories/blogCategory.repository");
const response = require("../utils/response.util");

const CANME = "taxonomy.controller.js ";

function parseBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";
  return undefined;
}

const taxonomyController = {
  ListTags: async (_req, res) => {
    try {
      const tags = await tagRepository.findAllAdmin();
      return response.success(res, tags);
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 500);
    }
  },

  CreateTag: async (req, res) => {
    try {
      const tag = await tagRepository.create(req.body);
      return response.success(res, tag, "Tạo tag thành công", 201);
    } catch (error) {
      console.error(CANME, error);
      if (error.code === "P2002") {
        return response.fail(res, "Tag đã tồn tại", 409);
      }
      return response.fail(res, error.message, 400);
    }
  },

  UpdateTag: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const tag = await tagRepository.update(id, req.body);
      return response.success(res, tag, "Cập nhật tag thành công");
    } catch (error) {
      console.error(CANME, error);
      if (error.code === "P2002") {
        return response.fail(res, "Tag trùng tên/slug", 409);
      }
      if (error.code === "P2025") {
        return response.fail(res, "Không tìm thấy tag", 404);
      }
      return response.fail(res, error.message, 400);
    }
  },

  RemoveTag: async (req, res) => {
    try {
      const id = Number(req.params.id);
      await tagRepository.remove(id);
      return response.success(res, null, "Xóa tag thành công");
    } catch (error) {
      console.error(CANME, error);
      if (error.code === "P2025") {
        return response.fail(res, "Không tìm thấy tag", 404);
      }
      return response.fail(res, error.message, 500);
    }
  },

  ListCategoriesPublic: async (_req, res) => {
    try {
      const categories = await blogCategoryRepository.findPublic();
      return response.success(res, categories);
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 500);
    }
  },

  ListCategoriesAdmin: async (_req, res) => {
    try {
      const categories = await blogCategoryRepository.findAllAdmin();
      return response.success(res, categories);
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 500);
    }
  },

  CreateCategory: async (req, res) => {
    try {
      const category = await blogCategoryRepository.create(req.body);
      return response.success(res, category, "Tạo danh mục thành công", 201);
    } catch (error) {
      console.error(CANME, error);
      if (error.code === "P2002") {
        return response.fail(res, "Slug danh mục đã tồn tại", 409);
      }
      return response.fail(res, error.message, 400);
    }
  },

  UpdateCategory: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const body = { ...req.body };
      if (body.isActive !== undefined) {
        body.isActive = parseBool(body.isActive);
      }
      const category = await blogCategoryRepository.update(id, body);
      return response.success(res, category, "Cập nhật danh mục thành công");
    } catch (error) {
      console.error(CANME, error);
      if (error.code === "P2002") {
        return response.fail(res, "Slug danh mục đã tồn tại", 409);
      }
      return response.fail(res, error.message, 400);
    }
  },

  RemoveCategory: async (req, res) => {
    try {
      const id = Number(req.params.id);
      await blogCategoryRepository.remove(id);
      return response.success(res, null, "Xóa danh mục thành công");
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 400);
    }
  },
};

module.exports = taxonomyController;
