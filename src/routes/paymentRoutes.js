const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const paymentController = require('../controllers/paymentController');

router.use(authMiddleware);
router.get('/my', paymentController.getMyPayments);
router.get('/request/:requestId', paymentController.getPaymentByRequest);
router.post('/request/:requestId/confirm-cash', requireRole('customer'), paymentController.confirmCashPayment);

module.exports = router;
