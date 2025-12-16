const garageRepository = require('../repositories/garageRepository');
const User = require('../models/User'); 

// 1. Garage Profile එක නිර්මාණය කිරීම
exports.createGarageProfile = async (userId, data) => {
    
    // 💡 Validation Logic
    const existingProfile = await garageRepository.findByUserId(userId); 
    if (existingProfile) {
        throw new Error("Garage profile already exists for this user.");
    }
    
    const garageData = {
        userId: userId,
        name: data.name,
        address: data.address,
        services: data.services || []
    };
    
    return await garageRepository.create(garageData);
};

// 2. Profile එක ලබා ගැනීම
exports.getGarageProfile = async (userId) => {
    return await garageRepository.findByUserId(userId);
};

// 3. Profile එක update කිරීම
exports.updateGarageProfile = async (userId, updateData) => {
    const dataToUpdate = {
        ...updateData,
        verificationStatus: "pending", 
        isVerified: false
    };
    return await garageRepository.updateByUserId(userId, dataToUpdate);
};

// 4. Admin Functions
