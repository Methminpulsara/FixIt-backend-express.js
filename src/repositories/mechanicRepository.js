const MechanicProfile = require("../models/Mechanic");

exports.createProfile = (data) => MechanicProfile.create(data);

exports.getByUserId = (userId) => {
  return MechanicProfile.findOne({ userId });
};

// update by user id
exports.updateByUserId = (userId, data) => {
  return MechanicProfile.findOneAndUpdate({ userId }, data, { new: true });
};

exports.updateByUserIdAprovedOrReject = (id, data) => {
  return MechanicProfile.findByIdAndUpdate(id, data, { new: true });
};

// ADMIN – FIND PENDING
exports.findPending = () => {
  return MechanicProfile.find({ verificationStatus: "pending" }).populate(
    "userId",
    "-password"
  );
};
