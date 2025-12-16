const mechanicRepository = require("../repositories/mechanicRepository");
const garageRepository = require('../repositories/garageRepository');
const User = require('../models/User');

exports.findPending = () =>{
    return mechanicRepository.findPending();
}

exports.approveMechanic = async (id) => {
    // Mechanic Profile එක Update කිරීම
    const updatedMechanic = await mechanicRepository.updateVerificationStatus(id, {
        verificationStatus: "approved",
        isVerified: true
    });
    if (!updatedMechanic) {
        throw new Error("Mechanic profile not found.");
    }

    await User.findByIdAndUpdate(updatedMechanic.userId, { isVerified: true }); 
    
    return updatedMechanic;
};
exports.rejectMechanic = async (id) => {
    // 1. Mechanic Profile එක Update කිරීම
    const updatedMechanic = await mechanicRepository.updateVerificationStatus(id, {
        verificationStatus: "rejected",
        isVerified: false
    });
    
    if (!updatedMechanic) {
        throw new Error("Mechanic profile not found.");
    }
    await User.findByIdAndUpdate(updatedMechanic.userId, { isVerified: false });
    return updatedMechanic;
};

exports.findPendingGarages = () =>{
    return garageRepository.findPending()
}


exports.approveGarage = async (garageId) => {
    const updatedGarage = await garageRepository.updateVerificationStatus(garageId, "approved", true);
        if (!updatedGarage) {
        throw new Error("Mechanic profile not found.");
    }
    await User.findByIdAndUpdate(updatedGarage.userId, { isVerified: true });
    return updatedGarage;
};

// Reject Logic එකට User Update එක එකතු කරමු
exports.rejectGarage = async (garageId) => {
    const updatedGarage = await garageRepository.updateVerificationStatus(garageId, "rejected", false);
     if (!updatedGarage) {
        throw new Error("Mechanic profile not found.");
    }
    await User.findByIdAndUpdate(updatedGarage.userId, { isVerified: false }); 
    return updatedGarage;
};