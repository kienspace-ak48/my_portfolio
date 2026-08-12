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

  async robots(req, res) {
    try {
      const text = await seoService.buildRobotsTxt(req);
      res.type("text/plain").send(text);
    } catch (error) {
      console.error("seo.controller.robots", error);
      res.status(500).type("text/plain").send("User-agent: *\nDisallow: /\n");
    }
  },

  async sitemap(req, res) {
    try {
      const xml = await seoService.buildSitemapXml(req);
      res.type("application/xml").send(xml);
    } catch (error) {
      console.error("seo.controller.sitemap", error);
      res.status(500).type("application/xml").send('<?xml version="1.0"?><urlset/>');
    }
  },
};

module.exports = seoController;
