const userRepo = require("../repositories/userRepository");


exports.getMyProfile = async (userId) => {
    return userRepo.findById(userId);
};


exports.updateMyProfile = async (userId, body) => {
    const allowed = ["firstname", "lastname", "phone", "displayname"];
    const updates = {};
    
    allowed.forEach(f => {
        if (body[f]) updates[f] = body[f];
    });
    
    return userRepo.updateById(userId, updates);
};