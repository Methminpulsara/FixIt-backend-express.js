const express = require('express');
const router = express.Router();
const garageController = require('../controllers/garageController');
const authMiddleware = require('../middleware/authMiddleware'); 
const requireRole = require('../middleware/requireRole'); 


router.post('/profile',authMiddleware,  requireRole('garage'),garageController.createProfile);
router.get('/profile',authMiddleware,garageController.getProfile);
router.put('/profile',authMiddleware,garageController.updateProfile);

module.exports = router;