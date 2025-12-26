const garageRepository = require('../repositories/garageRepository');
const reviewRepository = require('../repositories/reviewRepository'); 


// for remve photos
const fs = require('fs')
const path = require('path')

// 1. Garage Profile එක නිර්මාණය කිරීම
const mongoose = require('mongoose');
const User = require('../models/User');

exports.createGarageProfile = async (userId, data) => {
    // 1. Session එකක් ආරම්භ කිරීම
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. දැනටමත් profile එකක් තියෙනවදැයි බැලීම
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

        // 3. User model එකේ isOnboarded: true කිරීම (Session එක ඇතුළත)
        await User.findByIdAndUpdate(
            userId, 
            { isOnboarded: true }, 
            { session }
        );

        // 4. Garage Profile එක create කිරීම (Repository එකට session එක pass කරන්න)
        const newGarage = await garageRepository.create(garageData, { session });

        // 5. සියල්ල සාර්ථක නම් Commit කිරීම
        await session.commitTransaction();
        return newGarage;

    } catch (error) {
        // මොකක් හරි වැරදුණොත් කරපු ඔක්කොම වෙනස්කම් අහෝසි කිරීම
        await session.abortTransaction();
        throw error;
    } finally {
        // Session එක වසා දැමීම
        session.endSession();
    }
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

// upload photos
exports.uploadGaragePhoto = async (userId, fileUrl) => {
    
    const garage = await garageRepository.findByUserId(userId);

    if(garage && garage.photos.length >=3){
        throw new Error("3 photos only can Upload")
    }

    return await garageRepository.addPhoto(userId, fileUrl);
};

exports.deleteGaragePhoto = async (userId, fileUrl)=>{
    // 1. Database එකෙන් අයින් කරන්න
    const updatedGarage = await garageRepository.removePhoto(userId, fileUrl);

    // 2. සර්වර් එකේ ෆෝල්ඩර් එකෙන් මකා දමන්න
    // photoUrl එක "/uploads/name.jpg" ලෙස ඇති නිසා root path එක හදාගත යුතුයි
    const filePath = path.join(__dirname, '../../', fileUrl);

    fs.unlink(filePath, (err=>{
        if (err) console.error("File deletion error:", err);
    }))
    return updatedGarage;
}