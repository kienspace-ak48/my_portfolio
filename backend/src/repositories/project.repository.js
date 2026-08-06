const prisma = require("../configs/prisma.config");
const BaseRepository = require("./base.repository");

const CNAME = "project.repository.js ";

class ProjectRepository extends BaseRepository{
    constructor(){
        super(prisma.project)
    }

}

module.exports = new ProjectRepository();//instance singleton