const CNAME ="home.controller.js ";
const prisma = require('../configs/prisma.config');


const homeController = ()=>{
    return {
        Index: (req, res)=>{
            res.json({success: true, mess: "hello"});
        },
        ReadUser: async(req, res)=>{
            const users =await prisma.user.findMany();
            console.log('data', users);
            return res.json({success: true, data: users});
        },
        ReadProject: async(req, res)=>{
            const project = await prisma.project.findMany();
            console.log(project);
            return res.json({success: true, data: project})
        }
    }
}

module.exports = homeController;