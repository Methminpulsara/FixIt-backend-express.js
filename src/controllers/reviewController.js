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

exports.updateReview = async (req, res) => {
    try {
        const result = await reviewService.updateReview(req.user.id, req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await reviewService.deleteReview(req.user.id, req.params.id);
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};