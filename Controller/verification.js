const asyncHandler = require("express-async-handler");
const twilio = require("twilio");
require("dotenv").config();
const User = require("../models/userModel");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceID = process.env.TWILIO_SERVICE_ID;
const client = twilio(accountSid, authToken);

// Send OTP
const sendOTP = asyncHandler(async (req, res) => {
  let { phoneNumber } = req.body;

  console.log(phoneNumber);

  if (!phoneNumber.startsWith("+")) {
    phoneNumber = `+91${phoneNumber}`;
  }

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const verification = await client.verify.v2
      .services(serviceID)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    if (verification.status === "pending") {
      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    }
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// Verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, OTP } = req.body;

  if (!phoneNumber || !OTP) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceID)
      .verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: OTP,
      });

    if (verificationCheck.status === "approved") {
      await User.findOneAndUpdate(
        { phoneNumber },
        { $set: { "phoneNumber.isVerified": true } }
      );

      return res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = { verifyOTP, sendOTP };
