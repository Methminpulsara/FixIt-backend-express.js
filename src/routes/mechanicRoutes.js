const express = require("express")
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const mechanicController = require("../controllers/mechanicController");
const requireRole=  require('../middleware/requireRole')
const upload = require('../middleware/uploadMiddleware')

router.post('/' , authMiddleware , requireRole("mechanic"),  mechanicController.createProfile);
router.get('/' , authMiddleware , mechanicController.getProfile);
router.put('/' , authMiddleware , mechanicController.updateProfile);

// upload docs
router.post('/upload-doc' , authMiddleware , upload.single('documents') , mechanicController.uploadMechanicDocument)


module.exports = router;