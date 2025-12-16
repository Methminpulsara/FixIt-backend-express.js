const MechanicProfile = require("../models/Mechanic");

exports.createProfile = (data) => MechanicProfile.create(data);

exports.getByUserId = (userId) => {
  return MechanicProfile.findOne({ userId });
};

// update by user id
exports.updateByUserId = (userId, data) => {
  // new : true  ==> Update crmu ek return krnn 
  return MechanicProfile.findOneAndUpdate({ userId }, data, { new: true });
};

//  Admin Approve/Reject
exports.updateVerificationStatus = (id, data) => {
  return MechanicProfile.findByIdAndUpdate(id, data, { new: true });
};

// ADMIN – FIND PENDING
exports.findPending = () => {
  return MechanicProfile.find({ verificationStatus: "pending" }).populate(
    "userId",
    "-password"
  );
};
