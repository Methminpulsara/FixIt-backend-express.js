const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.create = (data) => {
  return Review.create(data);
};

exports.findOne = (query) => {
  return Review.findOne(query);
};

exports.findById = (reviewId) => {
  return Review.findById(reviewId);
};

exports.findByRequestId = (requestId) => {
  return Review.findOne({ requestId }).populate('customerId', 'displayName').populate('providerId', 'displayName');
};

exports.findByProviderId = (providerId) => {
  return Review.find({ providerId })
    .sort({ createdAt: -1 })
    .populate('customerId', 'displayName profilePic')
    .populate('providerId', 'displayName profilePic');
};

exports.getAverageRating = async (providerId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        providerId: new mongoose.Types.ObjectId(providerId),
      },
    },
    {
      $group: {
        _id: '$providerId',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  return stats.length > 0
    ? stats[0]
    : { averageRating: 0, count: 0 };
};

exports.getLatestReviews = (providerId, limit = 3) => {
  return Review.find({ providerId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('customerId', 'displayName profilePic');
};

exports.update = (reviewId, data) => {
  return Review.findByIdAndUpdate(reviewId, data, { new: true });
};

exports.delete = (reviewId) => {
  return Review.findByIdAndDelete(reviewId);
};