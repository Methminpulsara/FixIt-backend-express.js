// const User = require('../models/User')



// // near providerw check krnn 
// exports.findNearProviders = async (lng, lat, maxDistance, type) => {
//     return User.find({
//         type: type,
//         isVerified: true,

//         location: {
//             $near: {
//                 $geometry: { type: "Point", coordinates: [lng, lat] },
//                 $maxDistance: maxDistance * 1000
//             }
//         }
//     });
// };

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

    // 2. ඒ සොයාගත් අයගෙන් 'Approved' සහ 'Available' අය විතරක් පෙරා ගන්නවා (Filter)
    if (type === "mechanic") {
        return await Mechanic.find({
            userId: { $in: userIds },
            verificationStatus: "approved", // 💡 අනිවාර්යයි
            isAvailable: true               // 💡 අනිවාර්යයි
        }).populate("userId", "displayName location phone");

    } else if (type === "garage") {
        return await Garage.find({
            userId: { $in: userIds },
            verificationStatus: "approved", // 💡 අනිවාර්යයි
            isAvailable: true               // 💡 අනිවාර්යයි
        }).populate("userId", "displayName location phone");
    }
    
    return [];
};