const MechanicProfile = require("../models/Mechanic")



exports.createProfile = (data) => MechanicProfile.create(data);

exports.getByUserId = (userid)=>{
    MechanicProfile.findOne(userid);
}


exports.updateByUserId = (userid , data) =>{
    MechanicProfile.findByIdAndUpdate(
        {userid},
         data , 
         {new : true}
        );
} 




