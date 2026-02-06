const Payment = require('../models/Payment')


exports.createPayment = (data) => {
    return Payment.create(data);
};

exports.findById = (paymentId) => {
    return Payment.findById(id)
        // populate klam me id ekt adhala deytails ee table eken gnn puluwn request table eke okkma enw 
        .populate("requestId")
        // methna enne Display name and phone number ek 
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

exports.findByProvideId = (userId, role) => {
    const query = (role === "customer") ? { customerid: userId } : { providerId: userId }
    return Payment.findOne(query)
        .sort({ createdAt: -1 })
        .populate('requestId', "issueDescription");
};




