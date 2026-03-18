const MechanicProfile = require('../models/Mechanic');

exports.createProfile = (data) => MechanicProfile.create(data);

exports.getByUserId = (userId) => (
  MechanicProfile.findOne({ userId }).populate('userId', 'displayName email phone location username')
);

exports.updateByUserId = (userId, data) => (
  MechanicProfile.findOneAndUpdate({ userId }, data, { new: true }).populate('userId', 'displayName email phone location username')
);

exports.updateVerificationStatus = (id, data, options = {}) => (
  MechanicProfile.findByIdAndUpdate(id, data, { new: true, ...options }).populate('userId', '-password')
);

exports.findPending = () => MechanicProfile.find({ verificationStatus: 'pending' }).populate('userId', '-password').sort({ createdAt: -1 });
exports.findHistory = () => MechanicProfile.find({ verificationStatus: { $in: ['approved', 'rejected'] } }).populate('userId', '-password').sort({ updatedAt: -1 });

exports.updateDocuments = (userId, docType, fileUrl) => {
  const update = {};
  update[`documents.${docType}`] = fileUrl;
  return MechanicProfile.findOneAndUpdate({ userId }, { $set: update }, { new: true });
};
