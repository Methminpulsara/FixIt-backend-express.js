const GarageProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    garageName: String,
    address: String,
    documents: {
        brCertificate: String,
        license: String
    },
    workerCount: Number,
    servicesOffered: [String],
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
});
