const mechanicRepository = require("../repositories/mechanicRepository");



exports.findPending = () =>{
    return mechanicRepository.findPending();
}

exports.approveMechanic = async (id) => {
    return await mechanicRepository.updateByUserIdAprovedOrReject(id, {
        verificationStatus: "approved",
        isVerified: true
    });
};

exports.rejectMechanic = async (id) => {
    return await mechanicRepository.updateByUserIdAprovedOrReject(id, {
        verificationStatus: "rejected",
        isVerified: false
    });
};
