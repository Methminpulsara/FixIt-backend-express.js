const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const privacy = require("../middleware/privacy");
const uploadMiddleware = require('../middleware/uploadMiddleware')



router.get("/me", authMiddleware , userController.getMyProfile)
router.put("/me", authMiddleware, userController.updateMyProfile)

router.get("/:id", privacy , userController.getUserProfile)

router.patch("/me/visibility" , authMiddleware , userController.updateVisibiitySettings)

router.put("/location", authMiddleware, userController.updateLocation);

router.post('/upload-profile',
    authMiddleware,
    uploadMiddleware.single('profilePic'),
    userController.updateProfileImage
)
router.delete('/upload-profile',
    authMiddleware,
    userController.removeProfileImage
)



module.exports = router;
