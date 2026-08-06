const prisma = require("../configs/prisma.config");
const projectRepository = require("../repositories/project.repository");
const response = require("../utils/response.util");

const CANME = "project.controller.js ";

function projectController() {
  return {
    Index: async (req, res) => {
      try {
        const project = await projectRepository.findAll();
        return response.success(res, project);
      } catch (error) {
        console.log(CANME + error);
        return response.fail(res);
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
        console.log(CANME + error.message);
        return response.fail(res);
      }
    },
    Add: async (req, res) => {
      try {
        const data = req.body;
        // const tempData = {
        //   slug: "personal-portfolio",
        //   title: "Personal Portfolio",
        //   sumary: "Website portfolio cá nhân.",
        //   desc: "Portfolio giới thiệu bản thân và các dự án.",
        //   longDesc:
        //     "Xây dựng bằng React, Express, Prisma và MySQL. Hỗ trợ trang quản trị, đăng nhập JWT và quản lý project.",
        //   thumbnail: "/images/portfolio.png",
        //   isDisplay: true,
        //   finishedAt: new Date("2026-07-01"),
        //   demoUrl: "https://portfolio.example.com",
        //   repoUrl: "https://github.com/kienvu/personal-portfolio",
        //   featured: true,
        //   viewCount: 256,
        // };
        console.log(data);
        const task1 = await projectRepository.create(data);
        console.log(task1);
        return response.success(res, task1);
      } catch (error) {
        console.log(CANME + error.message);
        response.fail(res);
      }
    },
    Update: async (req, res) => {
      try {
        const id = Number(req.params.id);
        const data = req.body;
        const updated = await projectRepository.update(id, data);
        return response.success(res, updated);
      } catch (error) {
        console.log(CANME + error.message);
        return response.fail(res);
      }
    },
    Remove: async (req, res) => {
      try {
        const id = Number(req.params.id);
        await projectRepository.remove(id);
        return response.success(res, null, "Xóa dự án thành công");
      } catch (error) {
        console.log(CANME + error.message);
        return response.fail(res);
      }
    },
  };
}

module.exports = projectController;
