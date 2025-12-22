const reviewRepository = require('../repositories/reviewRepository');
const requestRepository = require('../repositories/requestRepository');

exports.submitReview = async (customerId, data) => {
    const { requestId, rating, comment } = data;

    // 1. Request එක ඇත්තටම තියෙනවද බලන්න
    const request = await requestRepository.findById(requestId);
    if (!request) throw new Error("Service request not found.");

    // 2. Request එක 'completed' ද බලන්න
    if (request.status !== 'completed') {
        throw new Error("You can only review completed services.");
    }

    // 3. මේ පාරිභෝගිකයාමද මේ Request එක දැම්මේ බලන්න
    if (request.customerId._id.toString() !== customerId) {
        throw new Error("You are not authorized to review this service.");
    }

    // 4. කලින් Review එකක් දීලද බලන්න
    const existingReview = await reviewRepository.findOne({ requestId });
    if (existingReview) throw new Error("You have already reviewed this service.");

    // 5. Review එක සේව් කරන්න
    return await reviewRepository.create({
        requestId,
        customerId,
        providerId: request.providerId._id,
        rating,
        comment
    });
};