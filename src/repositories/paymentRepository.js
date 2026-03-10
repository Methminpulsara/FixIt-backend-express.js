const Payment = require('../models/Payment')


exports.createPayment = (data) => {
    return Payment.create(data);
};

exports.findById = (id) => {
    return Payment.findById(id)
        .populate("requestId")
        .populate("customerId", "DisplayName phone")
        .populate("providerId", "DisplayName phone")

};


exports.findByRequestId = (requestId) => {
    return Payment.findOne({ requestId });
};


// status update krnn 
exports.UupdateStatus = (id, status, paidAt = null) => {
    const updateDate = { status };
    if (paidAt) updateDate.paidAt = paidAt;

    return Payment.findByIdAndUpdate(id, updateData, { new: true });
};

exports.findForUser = (userId, role) => {
    const query = (role === "customer") ? { customerid: userId } : { providerId: userId }
    return Payment.findOne(query)
        .sort({ createdAt: -1 })
        .populate('requestId', "issueDescription");
};




