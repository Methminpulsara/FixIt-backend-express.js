const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const adminOnly = require("../middleware/adminMiddleware")
const adminController = require("../controllers/adminController")


router.get('/mechanics/pending', authMiddleware ,adminOnly , adminController.getPendingMechanics)
router.patch('/mechanics/:id/approve', authMiddleware , adminOnly , adminController.approveMechanics)
router.patch('/mechanics/:id/reject', authMiddleware , adminOnly , adminController.rejectMechanics)

module.exports = router