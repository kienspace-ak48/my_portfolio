const projectRepository = require("../repositories/project.repository");
const response = require("../utils/response.util");

const CANME = "project.controller.js ";

function parseProjectBody(body) {
  const data = { ...body };

  if (data.finishedAt === "" || data.finishedAt === null) {
    data.finishedAt = null;
  } else if (data.finishedAt) {
    data.finishedAt = new Date(data.finishedAt);
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

  return data;
}

function projectController() {
  return {
    Index: async (req, res) => {
      try {
        const projects = await projectRepository.findPublic(req.query);
        return response.success(res, projects);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(
          res,
          process.env.NODE_ENV === "production"
            ? "Không thể tải danh sách dự án"
            : error.message,
          500,
        );
      }
    },

    AdminIndex: async (req, res) => {
      try {
        const projects = await projectRepository.findAllAdmin();
        return response.success(res, projects);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(
          res,
          process.env.NODE_ENV === "production"
            ? "Không thể tải danh sách dự án"
            : error.message,
          500,
        );
      }
    },

    Tags: async (_req, res) => {
      try {
        const tags = await projectRepository.findTagStats();
        return response.success(res, tags);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(res, error.message, 500);
      }
    },

    ShowBySlug: async (req, res) => {
      try {
        const project = await projectRepository.findBySlug(req.params.slug, {
          incrementView: true,
        });

        if (!project || !project.isDisplay) {
          return response.fail(res, "Không tìm thấy dự án", 404);
        }

        return response.success(res, project);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(res, error.message, 500);
      }
    },

    Show: async (req, res) => {
      try {
        const id = Number(req.params.id);
        const project = await projectRepository.findById(id);
        if (!project) {
          return response.fail(res, "Không tìm thấy dự án", 404);
        }
        return response.success(res, project);
      } catch (error) {
        console.error(CANME, error);
        return response.fail(res, error.message, 500);
      }
    },

    Add: async (req, res) => {
      try {
        const data = parseProjectBody(req.body);

        if (!data.title?.trim() || !data.slug?.trim()) {
          return response.fail(res, "Title và slug là bắt buộc", 400);
        }

        const project = await projectRepository.create(data);
        return response.success(res, project);
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
        const id = Number(req.params.id);
        const data = parseProjectBody(req.body);
        const updated = await projectRepository.update(id, data);
        return response.success(res, updated);
      } catch (error) {
        console.error(CANME, error);
        if (error.code === "P2002") {
          return response.fail(res, "Slug đã tồn tại", 409);
        }
        return response.fail(res, error.message, 500);
      }
    },

    Remove: async (req, res) => {
      try {
        const id = Number(req.params.id);
        await projectRepository.remove(id);
        return response.success(res, null, "Xóa dự án thành công");
      } catch (error) {
        console.error(CANME, error);
        return response.fail(res, error.message, 500);
      }
    },
  };
}

module.exports = projectController;
