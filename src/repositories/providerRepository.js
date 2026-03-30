

const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const Garage = require('../models/Garage');

exports.findNearProviders = async (lng, lat, maxDistance, type) => {
    // 1. මුලින්ම ලඟම ඉන්න අදාළ Type එකේ Usersලා සොයාගන්නවා
    const nearbyUsers = await User.find({
        type: type,
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $maxDistance: maxDistance * 1000
            }
        }
    }).select("_id");

    const userIds = nearbyUsers.map(u => u._id);

// for search aproved and available providers
    if (type === "mechanic") {
        return await Mechanic.find({
            userId: { $in: userIds },
            verificationStatus: "approved",
            isAvailable: true               
        }).populate("userId", "displayName location phone");

    } else if (type === "garage") {
        return await Garage.find({
            userId: { $in: userIds },
            verificationStatus: "approved",
            isAvailable: true               
        }).populate("userId", "displayName location phone");
    }
    
    return [];
};


