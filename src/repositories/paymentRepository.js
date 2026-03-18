const Payment = require('../models/Payment');

exports.createPayment = (data) => Payment.create(data);

exports.findById = (id) =>
  Payment.findById(id)
    .populate('requestId')
    .populate('customerId', 'displayName phone')
    .populate('providerId', 'displayName phone');

exports.findByRequestId = (requestId) =>
  Payment.findOne({ requestId })
    .populate('requestId')
    .populate('customerId', 'displayName phone')
    .populate('providerId', 'displayName phone');

exports.updateStatus = (id, status, paidAt = null) => {
  const updateData = { status };
  if (paidAt) updateData.paidAt = paidAt;
  return Payment.findByIdAndUpdate(id, updateData, { new: true })
    .populate('requestId')
    .populate('customerId', 'displayName phone')
    .populate('providerId', 'displayName phone');
};

exports.findForUser = (userId, role) => {
  const query = role === 'customer' ? { customerId: userId } : { providerId: userId };
  return Payment.find(query)
    .sort({ createdAt: -1 })
    .populate('requestId', 'issueDescription finalAmount paymentStatus status');
};
