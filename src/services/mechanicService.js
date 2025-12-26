// const mechanicRepository = require("../repositories/mechanicRepository");

// exports.createMechanicProfile = async (userId, body) => {
//     // 💡 Recommend: Here we should await the creation if we have the 'async' keyword.
//     const newProfile = await mechanicRepository.createProfile({
//         userId,
//         skills: body.skills || [],
//         experience: body.experience || 0,
//         documents: body.documents || {}
//     });
//     return newProfile;
// };

// exports.getMechanicProfile = async (userId) => { // 💡 Add async for consistency
//     return await mechanicRepository.getByUserId(userId); // 💡 Add await
// };

// exports.updateMechanicProfile = async (userId, body) => {
//     // 💡 Add await for better error handling and promise resolution
//     const updated = await mechanicRepository.updateByUserId(userId, {
//         ...body,
//         // When updating, we should reset verification status for re-approval
//         verificationStatus: "pending", 
//         isVerified: false
//     });
//     return updated;
// };

const mechanicRepository = require("../repositories/mechanicRepository");
const reviewRepository = require('../repositories/reviewRepository')
const User = require('../models/User')
const mongoose = require('mongoose');

// --- Mechanic Profile Management ---
exports.createMechanicProfile = async (userId, body) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingProfile = await mechanicRepository.getByUserId(userId);
        if (existingProfile) throw new Error("Mechanic profile already exists!");

        // 1. User Status එක Update කිරීම
        await User.findByIdAndUpdate(userId, { isOnboarded: true }, { session });

        // 2. Profile එක Create කිරීම
        // repository එකටත් session එක pass කරන්න ඕනේ
        const newProfile = await mechanicRepository.createProfile({
            userId,
            skills: body.skills || [],
            experience: body.experience || 0,
            documents: body.documents || {}
        }, { session });

        await session.commitTransaction();
        return newProfile;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

exports.getMechanicProfile = async (userId) => { 
    const profile = await mechanicRepository.getByUserId(userId);
    if (!profile) return null;

    // Rating stats සහ අවසන් reviews ලබා ගැනීම
    const ratingStats = await reviewRepository.getAverageRating(userId);
    const latestReviews = await reviewRepository.getLatestReviews(userId, 3);

    return {
        ...profile._doc, // MongoDB Document එකේ දත්ත
        averageRating: Math.round(ratingStats.averageRating * 10) / 10,
        totalReviews: ratingStats.count,
        recentFeedback: latestReviews
    };
};
exports.updateMechanicProfile = async (userId, body) => { 
    // Update කිරීමේදී Verification Status එක Reset කිරීම
    const updatedData = {
        ...body,
        verificationStatus: "pending", 
        isVerified: false 
    };
    return await mechanicRepository.updateByUserId(userId, updatedData); // 💡 await
};

exports.uploadMechanicDoc = async (userId, docType, fileUrl) => {
    return await mechanicRepository.updateDocuments(userId, docType, fileUrl);
};