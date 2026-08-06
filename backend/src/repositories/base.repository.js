class BaseRepository {
    constructor(model){
        this.model = model;
    }

    async create(data){
        return this.model.create({data})
    }
    async findAll(){
        return this.model.findMany();
    }
    async findById(id){
        return this.model.findUnique({
            where:{id}
        })
    }
    async update(id, data){
        return this.model.update({
            where: {id},
            data
        })
    }
    async remove(id){
        return this.model.delete({
            where: {id}
        })
    }
}

module.exports = BaseRepository;