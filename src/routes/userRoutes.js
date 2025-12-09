const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const privacy = require("../middleware/privacy");

// Owen profile manage
router.get("/me", authMiddleware , userController.getMyProfile)
router.put("/me", authMiddleware, userController.getMyProfile)

// Public profile (with privacy filtering)
router.get("/:id", privacy , userController.getUserProfile)

// Visibility settings
router.patch("/me/visibility" , authMiddleware , userController.updateVisibiitySettings)

router.put("/location", authMiddleware, userController.updateLocation);

module.exports = router;
