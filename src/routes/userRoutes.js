const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const privacy = require("../middleware/privacy");
const uploadMiddleware = require('../middleware/uploadMiddleware')



// Owen profile manage
router.get("/me", authMiddleware , userController.getMyProfile)
router.put("/me", authMiddleware, userController.updateMyProfile)

// Public profile (with privacy filtering)
router.get("/:id", privacy , userController.getUserProfile)

// Visibility settings
router.patch("/me/visibility" , authMiddleware , userController.updateVisibiitySettings)

router.put("/location", authMiddleware, userController.updateLocation);

router.post('/upload-profile',
    authMiddleware,
    uploadMiddleware.single('profilePic'),
    userController.updateProfileImage
)



module.exports = router;
