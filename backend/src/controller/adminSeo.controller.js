const seoService = require("../services/seo.service");
const response = require("../utils/response.util");
const seoRepository = require("../repositories/seo.repository");

const adminSeoController = {
  async show(req, res) {
    try {
      await seoService.ensureDefaults(req);
      const [global, pages] = await Promise.all([
        seoRepository.findGlobal(),
        seoRepository.findAllPageTemplates(),
      ]);
      return response.success(res, {
        global: seoService.serializeGlobal(global),
        pages: pages.map(seoService.serializePage),
      });
    } catch (error) {
      console.error("adminSeo.controller.show", error);
      return response.fail(res, error.message, 500);
    }
  },

  async updateGlobal(req, res) {
    try {
      const { ogImageUrl } = req.body ?? {};
      if (ogImageUrl && /\.(avif|webp|svg)(\?|$)/i.test(String(ogImageUrl))) {
        return response.fail(
          res,
          "OG image không hỗ trợ AVIF/WebP/SVG (Zalo/Facebook preview).",
          400,
        );
      }

      const global = await seoService.updateGlobalSettings(req.body ?? {});
      return response.success(res, seoService.serializeGlobal(global));
    } catch (error) {
      console.error("adminSeo.controller.updateGlobal", error);
      return response.fail(res, error.message, 500);
    }
  },

  async updatePage(req, res) {
    try {
      const { pageKey } = req.params;
      const page = await seoService.updatePageTemplate(pageKey, req.body ?? {});
      return response.success(res, seoService.serializePage(page));
    } catch (error) {
      console.error("adminSeo.controller.updatePage", error);
      return response.fail(res, error.message, 400);
    }
  },
};

module.exports = adminSeoController;
