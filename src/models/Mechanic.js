const MechanicProfileSchema = new mongoose.Schema({
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
    }
});
module.exports = mongoose.model("MechanicProfile", MechanicProfileSchema);
