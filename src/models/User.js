const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    displayName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,

    type: {
        type: String,
        enum: ["customer", "mechanic", "garage", "admin"],
        required: true
    },

    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }
    },

    visibilitySettings: {
        showProfile: { type: Boolean, default: true },
        showPhone: { type: Boolean, default: false },
        showLocation: { type: Boolean, default: false }
    },
    isVerified: { 
        type: Boolean,
        default: false 
    },
    profilePic: { type: String, default: "" }
}, { timestamps: true });

UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
