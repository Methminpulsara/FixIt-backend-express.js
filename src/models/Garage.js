const mongoose = require('mongoose')
const GarageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: String,
    services: [String], // e.g., ["Tire Repair", "Battery Change"]
    photos: [String],
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true // මුලින්ම Job එකක නිරත නොවන බව සලකයි.
    },
}, { timestamps: true });
// Location index එක User Schema එකේ තිබෙන නිසා මෙහි අනවශ්‍යයි.
module.exports = mongoose.model("Garage", GarageSchema);