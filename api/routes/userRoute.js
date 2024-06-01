const userController = require("../controllers/userController")
const express = require('express')
const router = express.Router();

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/setting-code", userController.settingCode)
router.post("/edit-profile/:userId", userController.editProfile)
router.get("/verify/:token", userController.verifyToken)
router.get("/reset-password/:token", userController.resetPasswords)
router.get("/change-password/:token", userController.changePassword)
router.get("/user/:userId", userController.getUser)
router.post("/follow", userController.follow)
router.post("/unfollow", userController.unfollow)

module.exports = router;



