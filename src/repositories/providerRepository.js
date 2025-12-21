const User = require('../models/User')



// near providerw check krnn 
exports.findNearProviders = async (lng, lat, maxDistance, type) => {
    return User.find({
        type: type,
        isVerified: true,

        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $maxDistance: maxDistance * 1000
            }
        }
    });
};