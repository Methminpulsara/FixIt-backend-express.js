const Review = require('../models/Review');

exports.create = (data) => {
    return Review.create(data);
};

exports.findOne = (query) => {
    return Review.findOne(query);
};

exports.findByProviderId = (providerId) => {
    return Review.find({ providerId }).populate('customerId', 'displayName');
};