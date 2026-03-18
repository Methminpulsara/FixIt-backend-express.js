const Garage = require('../models/Garage');

exports.create = (garageData) => Garage.create(garageData);
exports.findByUserId = (userId) => Garage.findOne({ userId }).populate('userId', '-password');
exports.updateByUserId = (userId, updateData) => Garage.findOneAndUpdate({ userId }, updateData, { new: true }).populate('userId', '-password');
exports.findPending = () => Garage.find({ verificationStatus: 'pending' }).populate('userId', '-password').sort({ createdAt: -1 });
exports.findHistory = () => Garage.find({ verificationStatus: { $in: ['approved', 'rejected'] } }).populate('userId', '-password').sort({ updatedAt: -1 });
exports.updateVerificationStatus = (garageId, status, isVerified, options = {}) => Garage.findByIdAndUpdate(garageId, { verificationStatus: status, isVerified }, { new: true, ...options }).populate('userId', '-password');
exports.addPhoto = (userId, fileUrl) => Garage.findOneAndUpdate({ userId }, { $push: { photos: fileUrl } }, { new: true });
exports.removePhoto = (userId, fileUrl) => Garage.findOneAndUpdate({ userId }, { $pull: { photos: fileUrl } }, { new: true });
