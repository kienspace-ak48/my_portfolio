const path = require("path");
const fs = require("fs");
const response = require("../utils/response.util");
const dbExportService = require("../services/dbExport.service");
const { seedBlogDemoPosts } = require("../services/blogSeed.service");

const CANME = "backup.controller.js ";

function backupFilename() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `personal-portfolio-backup-${stamp}.json`;
}

const backupController = {
  Stats: async (_req, res) => {
    try {
      const stats = await dbExportService.getTableStats();
      const savedBackups = dbExportService.listSavedBackups();
      return response.success(res, {
        stats,
        savedBackups: savedBackups.slice(0, 10),
        backupsDir: dbExportService.BACKUPS_DIR,
      });
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 500);
    }
  },

  ExportDownload: async (_req, res) => {
    try {
      const payload = await dbExportService.buildExportPayload();
      const json = JSON.stringify(payload, null, 2);
      const filename = backupFilename();

      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      return res.send(json);
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 500);
    }
  },

  ExportSave: async (_req, res) => {
    try {
      const saved = await dbExportService.saveBackupToDisk();
      return response.success(res, {
        filename: saved.filename,
        sizeBytes: saved.sizeBytes,
        exportedAt: saved.payload.exportedAt,
        counts: {
          users: saved.payload.users.length,
          projects: saved.payload.projects.length,
          blogPosts: saved.payload.blogPosts.length,
          stories: saved.payload.stories.length,
          galleryAssets: saved.payload.galleryAssets.length,
        },
      }, "Đã lưu backup trên server");
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 500);
    }
  },

  DownloadSaved: async (req, res) => {
    try {
      const filename = path.basename(req.params.filename);
      if (!/^backup-[\d-T]+\.json$/.test(filename)) {
        return response.fail(res, "Tên file không hợp lệ", 400);
      }

      const fullPath = path.join(dbExportService.BACKUPS_DIR, filename);
      if (!fs.existsSync(fullPath)) {
        return response.fail(res, "Không tìm thấy file backup", 404);
      }

      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      return res.sendFile(fullPath);
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 500);
    }
  },

  SeedBlogDemo: async (_req, res) => {
    try {
      const result = await seedBlogDemoPosts();
      return response.success(
        res,
        result,
        `Đã seed ${result.count} bài blog demo`,
      );
    } catch (error) {
      console.error(CANME, error);
      return response.fail(res, error.message, 500);
    }
  },
};

module.exports = backupController;
