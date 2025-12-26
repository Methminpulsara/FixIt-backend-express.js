const mechanicRepository = require("../repositories/mechanicRepository");
const garageRepository = require('../repositories/garageRepository');
const User = require('../models/User');
const mongoose = require('mongoose');


exports.findPending = () =>{
    return mechanicRepository.findPending();
}


// TRANSACTION USE KRNN ONEEEE 

exports.approveMechanic = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Mechanic Profile Update
        const updatedMechanic = await mechanicRepository.updateVerificationStatus(id, {
            verificationStatus: "approved",
            isVerified: true
        }, { session });

        if (!updatedMechanic) throw new Error("Mechanic profile not found.");

        // 2. User Update
        await User.findByIdAndUpdate(updatedMechanic.userId, { isVerified: true }, { session });

        await session.commitTransaction();
        return updatedMechanic;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

// Approve Garage සඳහාත් මේ විදිහටම session දාන්න:
exports.approveGarage = async (garageId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const updatedGarage = await garageRepository.updateVerificationStatus(garageId, "approved", true, { session });
        if (!updatedGarage) throw new Error("Garage profile not found.");

        await User.findByIdAndUpdate(updatedGarage.userId, { isVerified: true }, { session });

        await session.commitTransaction();
        return updatedGarage;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

exports.rejectMechanic = async (id) => {
    const updatedMechanic = await mechanicRepository.updateVerificationStatus(id, {
        verificationStatus: "rejected",
        isVerified: false
    });
    
    if (!updatedMechanic) {
        throw new Error("Mechanic profile not found.");
    }
    return updatedMechanic;
};

exports.findPendingGarages = () =>{
    return garageRepository.findPending()
}


// exports.approveGarage = async (garageId) => {
//     const updatedGarage = await garageRepository.updateVerificationStatus(garageId, "approved", true);
//         if (!updatedGarage) {
//         throw new Error("Mechanic profile not found.");
//     }
//     return updatedGarage;
// };

// Reject Logic එකට User Update එක එකතු කරමු
exports.rejectGarage = async (garageId) => {
    const updatedGarage = await garageRepository.updateVerificationStatus(garageId, "rejected", false);
     if (!updatedGarage) {
        throw new Error("Mechanic profile not found.");
    }
    return updatedGarage;
};