const userRepo = require("../repositories/nearbyMechanicRepository");

exports.getNearbyMechanics = async (location, radius) => {
    const lng = location.lng;
    const lat = location.lat;

    return userRepo.findNearbyMechanics(lng, lat, radius);
};
