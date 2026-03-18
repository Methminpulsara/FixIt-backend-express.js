const paymentRepository = require('../repositories/paymentRepository');
const requestRepository = require('../repositories/requestRepository');

exports.getPaymentByRequest = async (requestId, user) => {
  const payment = await paymentRepository.findByRequestId(requestId);
  if (!payment) throw new Error('Payment not found for this request.');

  const userId = user.id.toString();
  const isAllowed =
    payment.customerId._id.toString() === userId ||
    payment.providerId._id.toString() === userId ||
    user.type === 'admin';

  if (!isAllowed) throw new Error('You are not allowed to view this payment.');
  return payment;
};

exports.getMyPayments = async (user) => {
  if (!['customer', 'mechanic', 'garage', 'admin'].includes(user.type)) {
    throw new Error('Invalid user type.');
  }

  const role = user.type === 'customer' ? 'customer' : 'provider';
  return paymentRepository.findForUser(user.id, role);
};

exports.confirmCashPayment = async (requestId, user) => {
  const request = await requestRepository.findById(requestId);
  if (!request) throw new Error('Request not found.');

  if (request.customerId._id.toString() !== user.id.toString()) {
    throw new Error('Only the customer can confirm cash payment.');
  }

  if (request.status !== 'completed') {
    throw new Error('Cash payment can be confirmed only after service completion.');
  }

  const payment = await paymentRepository.findByRequestId(requestId);
  if (!payment) throw new Error('Payment record not found.');

  if (payment.status === 'completed') {
    return payment;
  }

  const updatedPayment = await paymentRepository.updateStatus(payment._id, 'completed', new Date());
  await requestRepository.updateById(requestId, { paymentStatus: 'paid_cash' });
  return updatedPayment;
};
