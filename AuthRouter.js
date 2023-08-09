const express = require("express");
const AuthController = require("../controller/authController");
const router = express.Router();

router.route("/signup").post(AuthController.signupAuth);
router.route("/login").post(AuthController.login);


module.exports = router;
