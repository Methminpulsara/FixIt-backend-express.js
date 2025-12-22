const Review = require('../models/Review');
const mongoose = require('mongoose');

exports.create = (data) => {
    return Review.create(data);
};

exports.findOne = (query) => {
    return Review.findOne(query);
};

exports.findByProviderId = (providerId) => {
    return Review.find({ providerId }).populate('customerId', 'displayName');
};

exports.getAverageRating = (providerId) => {
    return Review.aggregate([
        { 
            $match: { providerId: new mongoose.Types.ObjectId(providerId) } 
        },
        {
            $group: {
                _id: '$providerId',
                averageRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]).then(stats => {
        // Promise එකක් ඇතුළේ data ටික format කරලා යවනවා
        return stats.length > 0 ? stats[0] : { averageRating: 0, count: 0 };
    });
};

// අන්තිමට ලැබුණු Review Comments කිහිපය ලබා ගැනීම
exports.getLatestReviews = (providerId, limit = 3) => {
    return Review.find({ providerId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('customerId', 'displayName'); // පාරිභෝගිකයාගේ නම පෙන්වීමට
};