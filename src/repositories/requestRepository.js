const Request = require('../models/Request');

exports.create = (data) => Request.create(data);

exports.findById = (id) =>
  Request.findById(id)
    .populate('customerId', 'displayName phone')
    .populate('providerId', 'displayName phone');

exports.updateById = (id, data) =>
  Request.findByIdAndUpdate(id, data, { new: true })
    .populate('customerId', 'displayName phone')
    .populate('providerId', 'displayName phone');

exports.find = (query) =>
  Request.find(query)
    .sort({ createdAt: -1 })
    .populate('customerId', 'displayName phone')
    .populate('providerId', 'displayName phone');

exports.findCompletedJobsByProviderToday = (providerId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return Request.find({
    providerId,
    status: 'completed',
    completedAt: { $gte: startOfDay, $lte: endOfDay },
  });
};

exports.findAvailableNearby = (lng, lat, maxDistance, type) =>
  Request.find({
    status: 'pending',
    requestType: type,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: maxDistance * 1000,
      },
    },
  }).populate('customerId', 'displayName phone');

exports.findActiveRequestByProvider = (providerId) =>
  Request.findOne({
    providerId,
    status: { $in: ['accepted', 'in_progress'] },
  });
