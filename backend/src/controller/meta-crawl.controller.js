const response = require("../utils/response.util");
const { crawlMetaTags } = require("../services/meta-crawl.service");

function metaCrawlController() {
  return {
    Crawl: async (req, res) => {
      try {
        const url = String(req.query.url ?? "").trim();
        if (!url) {
          return response.fail(res, "Thiếu tham số url", 400);
        }

        const data = await crawlMetaTags(url);
        return response.success(res, data);
      } catch (error) {
        const message =
          error.name === "AbortError"
            ? "Hết thời gian chờ khi tải trang"
            : error.message || "Không thể crawl meta tags";

        return response.fail(res, message, 400);
      }
    },
  };
}

module.exports = metaCrawlController;
