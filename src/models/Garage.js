const mongoose = require('mongoose')

const GarageSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    address: String,
    // services: [String],["Tire Repair", "Battery Change"]
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
        default: true 
    },

}, { timestamps: true });


module.exports = mongoose.model("Garage", GarageSchema);