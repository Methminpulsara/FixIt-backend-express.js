const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const adminOnly = require("../middleware/adminMiddleware")
const adminController = require("../controllers/adminController")



router.get('/mechanics/pending', authMiddleware ,adminOnly , adminController.getPendingMechanics)
router.put('/mechanics/:id/approve', authMiddleware , adminOnly , adminController.approveMechanics)
router.put('/mechanics/:id/reject', authMiddleware , adminOnly , adminController.rejectMechanics)

router.get('/garages/pending', authMiddleware ,adminOnly , adminController.getPendingGarages)
router.put('/garages/:id/approve', authMiddleware , adminOnly , adminController.approveGarages)
router.put('/garages/:id/reject', authMiddleware , adminOnly , adminController.rejectGarages)

module.exports = router