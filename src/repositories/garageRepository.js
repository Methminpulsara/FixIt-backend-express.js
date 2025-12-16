const Garage = require("../models/Garage");

exports.create = (garageData) => {
    return Garage.create(garageData);
};

exports.findByUserId = (userId) => {
    return Garage.findOne({ userId });
};

exports.updateByUserId = (userId, updateData) => {
    return Garage.findOneAndUpdate({ userId }, updateData, { new: true });
};

exports.findPending = () => {
    return Garage.find({ verificationStatus: "pending" }).populate('userId', '-password');
};

exports.updateVerificationStatus = (garageId, status, isVerified) => {
    return Garage.findByIdAndUpdate(
        garageId,
        { verificationStatus: status, isVerified: isVerified },
        { new: true }
    ).populate('userId', '-password');
};