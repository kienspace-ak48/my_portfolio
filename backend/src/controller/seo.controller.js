const seoService = require("../services/seo.service");
const response = require("../utils/response.util");

const seoController = {
  async getConfig(req, res) {
    try {
      const data = await seoService.getPublicConfig(req);
      return response.success(res, data);
    } catch (error) {
      console.error("seo.controller.getConfig", error);
      return response.fail(res, error.message, 500);
    }
  },
};

module.exports = seoController;
