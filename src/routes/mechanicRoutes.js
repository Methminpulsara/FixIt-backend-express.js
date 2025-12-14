const express = require("express")
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const mechanicController = require("../controllers/mechanicController");
const requireRole=  require('../middleware/requireRole')



router.post('/' , authMiddleware , requireRole("mechanic"),  mechanicController.createProfile);
router.get('/' , authMiddleware , mechanicController.getProfile);
router.put('/' , authMiddleware , mechanicController.updateProfile);

module.exports = router;