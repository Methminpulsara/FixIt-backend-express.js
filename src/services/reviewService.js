const reviewRepository = require('../repositories/reviewRepository');
const requestRepository = require('../repositories/requestRepository');

exports.submitReview = async (customerId, data) => {
  const { requestId, rating, comment } = data;

  if (!requestId) {
    throw new Error('Request ID is required.');
  }

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    throw new Error('Rating must be between 1 and 5.');
  }

  const request = await requestRepository.findById(requestId);
  if (!request) {
    throw new Error('Service request not found.');
  }

  if (request.status !== 'completed') {
    throw new Error('You can only review completed services.');
  }

  const requestCustomerId =
    request.customerId?._id?.toString?.() || request.customerId?.toString?.();

  if (requestCustomerId !== customerId) {
    throw new Error('You are not authorized to review this service.');
  }

  if (!request.providerId) {
    throw new Error('This request does not have an assigned provider.');
  }

  const existingReview = await reviewRepository.findOne({ requestId });
  if (existingReview) {
    throw new Error('You have already reviewed this service.');
  }

  const providerId =
    request.providerId?._id?.toString?.() || request.providerId?.toString?.();

  return reviewRepository.create({
    requestId,
    customerId,
    providerId,
    rating: Number(rating),
    comment: comment || '',
  });
};

exports.updateReview = async (customerId, reviewId, data) => {
  const { rating, comment } = data;

  const review = await reviewRepository.findById(reviewId);
  if (!review) {
    throw new Error('Review not found.');
  }

  if (review.customerId.toString() !== customerId) {
    throw new Error('You can only edit your own reviews.');
  }

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    throw new Error('Rating must be between 1 and 5.');
  }

  return reviewRepository.update(reviewId, {
    rating: Number(rating),
    comment: comment || '',
  });
};

exports.deleteReview = async (customerId, reviewId) => {
  const review = await reviewRepository.findById(reviewId);
  if (!review) {
    throw new Error('Review not found.');
  }

  if (review.customerId.toString() !== customerId) {
    throw new Error('You can only delete your own reviews.');
  }

  return reviewRepository.delete(reviewId);
};

exports.getProviderReviews = async (providerId) => {
  if (!providerId) {
    throw new Error('Provider ID is required.');
  }

  return reviewRepository.findByProviderId(providerId);
};

exports.getProviderReviewSummary = async (providerId) => {
  if (!providerId) {
    throw new Error('Provider ID is required.');
  }

  const stats = await reviewRepository.getAverageRating(providerId);
  const latestReviews = await reviewRepository.getLatestReviews(providerId, 3);

  return {
    averageRating: Number((stats.averageRating || 0).toFixed(1)),
    count: stats.count || 0,
    latestReviews,
  };
};

exports.getMyReviewByRequest = async (customerId, requestId) => {
  if (!requestId) {
    throw new Error('Request ID is required.');
  }

  const review = await reviewRepository.findOne({
    requestId,
    customerId,
  });

  return review;
};