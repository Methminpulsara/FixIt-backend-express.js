const express = require('express');
const router = express.Router();
const garageController = require('../controllers/garageController');
const authMiddleware = require('../middleware/authMiddleware'); 
const requireRole = require('../middleware/requireRole'); 
const upload = require('../middleware/uploadMiddleware');


router.post('/profile',authMiddleware,  requireRole('garage'),garageController.createProfile);
router.get('/profile',authMiddleware,garageController.getProfile);
router.put('/profile',authMiddleware,garageController.updateProfile);


// router.post('/upload-photo', authMiddleware , upload.single('photo') , garageController.uploadGaragePhoto)
router.post('/upload-photo', authMiddleware,requireRole('garage'), upload.single('photo'), garageController.uploadGaragePhoto);

// delete photo
router.delete('/delete-photo' , authMiddleware, requireRole("garage") , garageController.deletePhoto)

module.exports = router;