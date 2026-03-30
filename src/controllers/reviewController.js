const reviewService = require('../services/reviewService');

exports.createReview = async (req, res) => {
  try {
    const result = await reviewService.submitReview(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const result = await reviewService.updateReview(
      req.user.id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getProviderReviews(req.params.providerId);

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProviderReviewSummary = async (req, res) => {
  try {
    const data = await reviewService.getProviderReviewSummary(req.params.providerId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyReviewByRequest = async (req, res) => {
  try {
    const data = await reviewService.getMyReviewByRequest(
      req.user.id,
      req.params.requestId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};