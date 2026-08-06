const CNAME = "user.service.js ";
const userRepo = require('../repositories/user.repository');
const bcrypt = require('../utils/bcrypt.util');

async function createUser(dto){
    const exited = await userRepo.findByEmail(dto.email);
    if(exited){
        throw new Error("Email already existed");
    }
    dto.password = await bcrypt.hash(dto.password);
    
    return userRepo.create(dto);
}

module.exports = {
    createUser
}