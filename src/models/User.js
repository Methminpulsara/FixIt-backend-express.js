const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        },

        displayName: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["customer", "mechanic", "garage"],
            required: true
        },

        // LOCATION FOR REALTIME
   location: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],  // [lng, lat]
        default: [0,0]
    }
},


        // PRIVACY SETTINGS (MATCHING applyUserPrivacy system)
        visibilitySettings: {
            showProfile: { type: Boolean, default: true },
            showPhone: { type: Boolean, default: false },
            showLocation: { type: Boolean, default: false }
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
