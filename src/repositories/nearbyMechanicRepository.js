const User = require("../models/User");

exports.findNearbyMechanics = async (lng, lat, distanceInMeters = 5000) => {
    
    return User.find({
        type: "mechanic",

        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                $maxDistance: distanceInMeters
            }
        }
    }).select("-password");
};

