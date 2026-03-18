const mongoose = require('mongoose');

const GarageSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true, trim: true },
        address: { type: String, trim: true },
        services: [{ type: String, trim: true }],
        photos: [{ type: String }],
        verificationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

GarageSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Garage', GarageSchema);
