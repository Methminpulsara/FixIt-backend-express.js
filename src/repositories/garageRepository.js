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

exports.updateVerificationStatus = (garageId, status, isVerified, options = {}) => {
    return Garage.findByIdAndUpdate(
        garageId,
        { verificationStatus: status, isVerified: isVerified },
        { new: true, ...options } // session එක මෙතනට pass වේ
    ).populate('userId', '-password');
};

exports.addPhoto = (userId, fileUrl) => {
    // Photos කියන්නේ array එකක් නිසා $push පාවිච්චි කරනවා
    return Garage.findOneAndUpdate(
        { userId }, 
        { $push: { photos: fileUrl } }, 
        { new: true }
    );
};

exports.removePhoto = (userId , fileUrl) =>{
    return Garage.findOneAndUpdate(
        {userId},
        {$pull : {photos:fileUrl}},
        {new:true}
    )
}

