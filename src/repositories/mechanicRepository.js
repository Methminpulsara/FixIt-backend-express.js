const MechanicProfile = require("../models/Mechanic")



exports.createProfile = (data) => MechanicProfile.create(data);

exports.getByUserId = (userid)=>{
    return MechanicProfile.findOne({userid});
}


exports.updateByUserId = (userid , data) =>{
   return MechanicProfile.findByIdAndUpdate(
        {userid},
         data , 
         {new : true}
        );
}


exports.findPending =() =>{
    return MechanicProfile.find({
        verificationStatus:"pending"
    }).populate("userId", "-password")
}






