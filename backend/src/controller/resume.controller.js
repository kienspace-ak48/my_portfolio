const resumeRepository = require("../repositories/resume.repository");
const resumeService = require("../services/resume.service");
const response = require("../utils/response.util");
const fs = require("fs");
const {
  saveResumeCv,
  deleteResumeCv,
  buildCvDownloadFileName,
  getResumeCvAbsolutePath,
} = require("../utils/localUpload.util");

const resumeController = {
  async getPublic(req, res) {
    try {
      const data = await resumeService.getPublic();
      return response.success(res, data);
    } catch (error) {
      console.error("resume.controller.getPublic", error);
      return response.fail(res, error.message, 500);
    }
  },

  async getAdmin(req, res) {
    try {
      const data = await resumeService.getAdmin();
      return response.success(res, data);
    } catch (error) {
      console.error("resume.controller.getAdmin", error);
      return response.fail(res, error.message, 500);
    }
  },

  async update(req, res) {
    try {
      const data = await resumeService.updateContent(req.body?.content ?? req.body);
      return response.success(res, data);
    } catch (error) {
      console.error("resume.controller.update", error);
      return response.fail(res, error.message, 400);
    }
  },

  async uploadCv(req, res) {
    try {
      if (!req.file) {
        return response.fail(res, "Thiếu file PDF", 400);
      }

      if (req.file.mimetype !== "application/pdf") {
        return response.fail(res, "Chỉ chấp nhận file PDF", 400);
      }

      const existing = await resumeRepository.find();
      const oldStoredFileName = resumeService.getStoredCvFileName(existing);

      const { storedFileName, publicUrl } = await saveResumeCv(
        req.file.buffer,
        req.file.originalname,
      );

      const row = await resumeService.updateCvFile({
        url: publicUrl,
        fileName: req.file.originalname,
        publicId: storedFileName,
      });

      if (oldStoredFileName && oldStoredFileName !== storedFileName) {
        await deleteResumeCv(oldStoredFileName);
      }

      return response.success(res, {
        cvPdfUrl: row.cvPdfUrl,
        cvPdfFileName: row.cvPdfFileName,
      });
    } catch (error) {
      console.error("resume.controller.uploadCv", error);
      return response.fail(res, error.message, 500);
    }
  },

  async downloadCv(req, res) {
    try {
      const existing = await resumeRepository.find();
      const storedFileName = resumeService.getStoredCvFileName(existing);

      if (!storedFileName) {
        return response.fail(res, "Chưa có file CV", 404);
      }

      const absolutePath = getResumeCvAbsolutePath(storedFileName);

      try {
        await fs.promises.access(absolutePath, fs.constants.R_OK);
      } catch {
        return response.fail(res, "Không tìm thấy file CV", 404);
      }

      const downloadName = buildCvDownloadFileName(existing?.cvPdfFileName);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);

      const stream = fs.createReadStream(absolutePath);
      stream.on("error", (error) => {
        console.error("resume.controller.downloadCv.stream", error);
        if (!res.headersSent) {
          response.fail(res, "Không thể tải file CV", 500);
        } else {
          res.end();
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("resume.controller.downloadCv", error);
      return response.fail(res, error.message, 500);
    }
  },

  async removeCv(req, res) {
    try {
      const existing = await resumeRepository.find();
      const oldStoredFileName = resumeService.getStoredCvFileName(existing);
      const data = await resumeService.clearCvFile();

      if (oldStoredFileName) {
        await deleteResumeCv(oldStoredFileName);
      }

      return response.success(res, {
        cvPdfUrl: data.cvPdfUrl,
        cvPdfFileName: data.cvPdfFileName,
      });
    } catch (error) {
      console.error("resume.controller.removeCv", error);
      return response.fail(res, error.message, 500);
    }
  },
};

module.exports = resumeController;
