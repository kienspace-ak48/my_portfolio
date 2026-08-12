const BaseRepository = require("./base.repository");
const prisma = require('../configs/prisma.config');

const CNAME ="story.repository.js ";

class StoryRepository extends BaseRepository{
    constructor(){
        super(prisma.story);
    }
    
    async findAll2(){
        const now = new Date();
        return prisma.story.findMany({
            where: {
                OR: [{ isPinned: true }, { expiresAt: { gt: now } }],
            },
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
            include: {
                user: {
                    select:{id: true, name: true},
                },
                _count: { select: { views: true } },
            }
        })
    }

    async findAllAdmin(){
        return prisma.story.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                _count: { select: { views: true } },
            },
        });
    }
}

module.exports = new StoryRepository();