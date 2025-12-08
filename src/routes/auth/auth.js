const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");
const authMiddleware = require("../../middleware/authMiddleware");
const userController = require("../../controllers/userController");

router.post("/register", authController.register);
router.post("/login", authController.login);


router.get('/me' , authMiddleware ,userController.getMyProfile);
router.put("/me" , authMiddleware , userController.updateMyProfile)



module.exports = router;
