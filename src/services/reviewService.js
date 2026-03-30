const reviewRepository = require('../repositories/reviewRepository');
const requestRepository = require('../repositories/requestRepository');

exports.submitReview = async (customerId, data) => {
    const { requestId, rating, comment } = data;

    const request = await requestRepository.findById(requestId);
    if (!request) throw new Error("Service request not found.");

    if (request.status !== 'completed') {
        throw new Error("You can only review completed services.");
    }

    if (request.customerId._id.toString() !== customerId) {
        throw new Error("You are not authorized to review this service.");
    }

    const existingReview = await reviewRepository.findOne({ requestId });
    if (existingReview) throw new Error("You have already reviewed this service.");

    return await reviewRepository.create({
        requestId,
        customerId,
        providerId: request.providerId._id,
        rating,
        comment
    });
};


exports.updateReview = async (customerId, reviewId, data) => {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw new Error("Review not found.");

    if (review.customerId.toString() !== customerId) {
        throw new Error("You can only edit your own reviews.");
    }

    return await reviewRepository.update(reviewId, {
        rating: data.rating,
        comment: data.comment
    });
};

exports.deleteReview = async (customerId, reviewId) => {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw new Error("Review not found.");

    if (review.customerId.toString() !== customerId) {
        throw new Error("You can only delete your own reviews.");
    }

    return await reviewRepository.delete(reviewId);
};