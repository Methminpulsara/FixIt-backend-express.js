const garageRepository = require('../repositories/garageRepository');
const reviewRepository = require('../repositories/reviewRepository'); 


const fs = require('fs')
const path = require('path')

const mongoose = require('mongoose');
const User = require('../models/User');

exports.createGarageProfile = async (userId, data) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
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

        await User.findByIdAndUpdate(
            userId, 
            { isOnboarded: true }, 
            { session }
        );

        const newGarage = await garageRepository.create(garageData, { session });

        await session.commitTransaction();
        return newGarage;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

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

exports.updateGarageProfile = async (userId, updateData) => {

    const dataToUpdate = {
        ...updateData,
        verificationStatus: "pending", 
        isVerified: false
    };
    return await garageRepository.updateByUserId(userId, dataToUpdate);
};

exports.uploadGaragePhoto = async (userId, fileUrl) => {
    
    const garage = await garageRepository.findByUserId(userId);

    if(garage && garage.photos.length >=3){
        throw new Error("3 photos only can Upload")
    }

    return await garageRepository.addPhoto(userId, fileUrl);
};

exports.deleteGaragePhoto = async (userId, fileUrl)=>{
    const updatedGarage = await garageRepository.removePhoto(userId, fileUrl);

    const filePath = path.join(__dirname, '../../', fileUrl);

    fs.unlink(filePath, (err=>{
        if (err) console.error("File deletion error:", err);
    }))
    return updatedGarage;
}