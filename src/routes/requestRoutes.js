const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const requestController = require('../controllers/requestController');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);
router.get('/get/history', requestController.getMyRequests);
router.get('/nearby', requestController.getNearbyRequests);
router.post('/', requireRole('customer'), upload.single('damageImage'), requestController.createRequest);
router.post('/:id/accept', requireRole(['mechanic', 'garage']), requestController.acceptRequest);
router.post('/:id/complete', requireRole(['mechanic', 'garage']), requestController.completeRequest);
router.get('/provider-stats', requestController.getProviderStats);
router.post('/update-location', requestController.updateLocation);

module.exports = router;
