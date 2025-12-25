    const mongoose = require("mongoose");

    const Mechanic = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        skills: [String],
        experience: Number,

        documents: {
            nic: String,
            certificate: String,
            license: String
        },

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

    module.exports = mongoose.model("Mechanic", Mechanic);
