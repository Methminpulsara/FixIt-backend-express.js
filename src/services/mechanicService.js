

const mechanicRepository = require("../repositories/mechanicRepository");
const reviewRepository = require('../repositories/reviewRepository')
const User = require('../models/User')
const mongoose = require('mongoose');

exports.createMechanicProfile = async (userId, body) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingProfile = await mechanicRepository.getByUserId(userId);
        if (existingProfile) throw new Error("Mechanic profile already exists!");

        await User.findByIdAndUpdate(userId, { isOnboarded: true }, { session });

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

    const ratingStats = await reviewRepository.getAverageRating(userId);
    const latestReviews = await reviewRepository.getLatestReviews(userId, 3);

    return {
        ...profile._doc,
        averageRating: Math.round(ratingStats.averageRating * 10) / 10,
        totalReviews: ratingStats.count,
        recentFeedback: latestReviews
    };
};
exports.updateMechanicProfile = async (userId, body) => { 
    const updatedData = {
        ...body,
        verificationStatus: "pending", 
        isVerified: false 
    };
    return await mechanicRepository.updateByUserId(userId, updatedData);
};

exports.uploadMechanicDoc = async (userId, docType, fileUrl) => {
    return await mechanicRepository.updateDocuments(userId, docType, fileUrl);
};