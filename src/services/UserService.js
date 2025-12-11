const userRepo = require("../repositories/userRepository");


exports.getMyProfile = async (userId) => {
    return userRepo.findById(userId);
};


exports.updateMyProfile = async (userId, body) => {
    const allowed = ["firstName", "lastName", "phone", "displayName"];
    const updates = {};
    
    allowed.forEach(f => {
        if (body[f]) updates[f] = body[f];
    });
    
    return userRepo.updateById(userId, updates);
};


exports.updateVisibilitySettings = async (userId, body) =>{
    const allowed = ["showProfile", "showPhone", "showLocation"];
    const visibility = {};

    allowed.forEach(key=>{
        if(body[key] !== undefined){
            visibility[key] = body[key];
        }
    })

    return userRepo.updateVisibility(userId, visibility);

};


exports.updateLocation = async (userId, location) => {

    const formatted = {
        type: "Point",
        coordinates: [location.lng, location.lat]
    };

    return userRepo.updateByIdLocation(userId, { location: formatted });
};