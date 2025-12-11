const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const nearbyController = require("../controllers/nearbyMechanicController")
const privacy = require("../middleware/privacy");



// Owen profile manage
router.get("/me", authMiddleware , userController.getMyProfile)
router.put("/me", authMiddleware, userController.updateMyProfile)

// Public profile (with privacy filtering)
router.get("/:id", privacy , userController.getUserProfile)

// Visibility settings
router.patch("/me/visibility" , authMiddleware , userController.updateVisibiitySettings)

router.put("/location", authMiddleware, userController.updateLocation);


// GET nearby mechanics
// /api/v1/mechanics/nearby?lat=7.2298&lng=79.8589&radius=5000
router.get("/mechanics/nearby", authMiddleware, nearbyController.getNearbyMechanics);


module.exports = router;
