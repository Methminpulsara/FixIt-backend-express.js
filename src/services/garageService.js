const garageRepository = require('../repositories/garageRepository');
const reviewRepository = require('../repositories/reviewRepository'); 

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
    const profile = await garageRepository.findByUserId(userId);
    if (!profile) return null;

    const ratingStats = await reviewRepository.getAverageRating(userId);
    const latestReviews = await reviewRepository.getLatestReviews(userId, 3);

    return {
        ...profile._doc,
        averageRating: Math.round(ratingStats.averageRating * 10) / 10,
        totalReviews: ratingStats.count,
        recentFeedback: latestReviews
    };
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
