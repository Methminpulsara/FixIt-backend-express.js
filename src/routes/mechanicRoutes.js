const express = require("express")
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const mechanicController = require("../controllers/mechanicController");



router.post('/' , authMiddleware , mechanicController.createProfile);
router.get('/' , authMiddleware , mechanicController.getProfile);
router.put('/' , authMiddleware , mechanicController.updateProfile);

module.exports = router;