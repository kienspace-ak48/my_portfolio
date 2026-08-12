const fs = require("fs");
const path = require("path");
const { PUBLIC_PATH } = require("../configs/myPath.config");

const RESUME_CV_DIR = path.join(PUBLIC_PATH, "uploads", "resume");

async function ensureResumeCvDir() {
  await fs.promises.mkdir(RESUME_CV_DIR, { recursive: true });
}

function buildStoredFileName(originalName) {
  const stem =
    path
      .basename(originalName, path.extname(originalName))
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 60) || "cv";
  return `${stem}-${Date.now()}.pdf`;
}

async function saveResumeCv(buffer, originalName) {
  await ensureResumeCvDir();
  const storedFileName = buildStoredFileName(originalName);
  const absolutePath = path.join(RESUME_CV_DIR, storedFileName);
  await fs.promises.writeFile(absolutePath, buffer);

  return {
    storedFileName,
    publicUrl: `/uploads/resume/${storedFileName}`,
  };
}

async function deleteResumeCv(storedFileName) {
  if (!storedFileName) return;

  const safeName = path.basename(storedFileName);
  const absolutePath = path.join(RESUME_CV_DIR, safeName);

  try {
    await fs.promises.unlink(absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("localUpload.deleteResumeCv", error.message);
    }
  }
}

module.exports = {
  RESUME_CV_DIR,
  saveResumeCv,
  deleteResumeCv,
};
