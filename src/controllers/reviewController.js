const reviewService = require('../services/reviewService');

exports.createReview = async (req, res) => {
    try {
console.log("Service Object:", reviewService);
        const result = await reviewService.submitReview(req.user.id, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};