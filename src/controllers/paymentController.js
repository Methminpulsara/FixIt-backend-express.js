const paymentService = require('../services/paymentService');

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await paymentService.getMyPayments(req.user);
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPaymentByRequest = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentByRequest(req.params.requestId, req.user);
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.confirmCashPayment = async (req, res) => {
  try {
    const payment = await paymentService.confirmCashPayment(req.params.requestId, req.user);
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
