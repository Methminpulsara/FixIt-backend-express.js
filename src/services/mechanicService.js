const mechanicRepository = require("../repositories/mechanicRepository")



exports.createMechanicProfile = async (userId, body) => {
    return mechanicRepository.createProfile({
        userId,
        skills: body.skills || [],
        experience: body.experience || 0,
        documents: body.documents || {}
    });
};

exports.getMechanicProfile = (userId) => {
    return mechanicRepository.getByUserId(userId);
};

exports.updateMechanicProfile = async (userId, body) => {
    return await mechanicRepository.updateByUserId(userId, body);
};