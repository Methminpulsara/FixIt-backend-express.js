const mechanicRepository = require("../repositories/mechanicRepository");



exports.findPending = () =>{
    return mechanicRepository.findPending();
}

exports.approveMechanic = (id) => {
    return mechanicRepository.updateByUserId(id , {
        verificationStatus : "approved",
        isVerified : true
    });
};

exports.rejectMechanic = (id) => {
    return mechanicRepository.updateByUserId(id , {
        verificationStatus : "rejected",
        isVerified : false
    });
};

