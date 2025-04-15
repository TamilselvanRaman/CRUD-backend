const express = require("express");
const { registerUser, loginUser } = require("../Controller/authController");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../Controller/verification");

router.post("/register", registerUser);
router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.post("/login", loginUser);


module.exports = router;
