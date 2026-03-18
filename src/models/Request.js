const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    requestType: {
      type: String,
      enum: ['mechanic', 'garage'],
      required: true,
    },
    issueDescription: { type: String, required: true, trim: true },
    vehicleDetails: { type: String, trim: true },
    estimatedCost: { type: Number, min: 0, default: 0 },
    finalAmount: { type: Number, min: 0, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['not_applicable', 'pending_cash', 'paid_cash'],
      default: 'not_applicable',
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    acceptedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    damageImage: { type: String, default: null },
  },
  { timestamps: true }
);

RequestSchema.index({ location: '2dsphere' });
RequestSchema.index({ customerId: 1, createdAt: -1 });
RequestSchema.index({ providerId: 1, createdAt: -1 });

module.exports = mongoose.model('Request', RequestSchema);
