const User = require('../models/User')
exports.findNearProviders = async (lng, lat, maxDistance, type) => {
    return User.find({
        type: type, // 'mechanic' හෝ 'garage' ලෙස dynamic ලෙස ලබා දෙයි
        isVerified: true,
        isAvailable:true,
        // මෙහිදී 'isAvailable' field එකක් තිබේ නම් එයත් check කරන්න
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $maxDistance: maxDistance * 1000
            }
        }
    });
};