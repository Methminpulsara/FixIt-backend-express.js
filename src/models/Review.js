const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ providerId: 1, createdAt: -1 });
ReviewSchema.index({ customerId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);