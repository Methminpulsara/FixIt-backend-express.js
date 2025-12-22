const MechanicProfile = require("../models/Mechanic");
const User = require('../models/User');

exports.createProfile = (data) => MechanicProfile.create(data);

// 💡 මෙතැනදී .populate එක එකතු කළා. එවිට User model එකේ තියෙන විස්තරත් ලැබෙනවා.
exports.getByUserId = (userId) => {
  return MechanicProfile.findOne({ userId }).populate(
    "userId", 
    "displayName email phone location"
  );
};

// update by user id
exports.updateByUserId = (userId, data) => {
  return MechanicProfile.findOneAndUpdate({ userId }, data, { new: true }).populate(
    "userId", 
    "displayName email phone location"
  );
};

// Admin Approve/Reject
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