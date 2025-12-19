const MechanicProfile = require("../models/Mechanic");
const User = require('../models/User')

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

//find available machanics near to customer 
exports.findNearMechanics = (lng, lat , maxDistance) =>{
  return User.find({
    type:"mechanic",
    isVerified:true,

    // using 2dphere
    location:{
      $near:{
        $geometry: {type : "Point" , coordinates:[lng, lat]},
        $maxDistance: maxDistance * 1000 
      }
    }
  })
}