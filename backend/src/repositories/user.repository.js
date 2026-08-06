const CNAME = "user.repository.js ";

const prisma = require('../configs/prisma.config');

async function create(data){
    return prisma.user.create({
        data
    })
}

async function findAll(){
    return prisma.user.findMany();
}

async function findByEmail(email){
    return prisma.user.findUnique({
        where: {email}
    })
}

async function findById(id){
    return prisma.user.findUnique({
        where: {
            id
        }
    })
}

async function update(id, data){
    return prisma.user.update({
        where: {id},
        data
    })
}

async function remove(id){
    return prisma.user.delete({
        where: {id}
    })
}

module.exports ={
    create,
    findAll,
    findById,
    update,
    remove,
    findByEmail
}
