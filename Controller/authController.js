const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, phoneNumber, email, password } = req.body;

  if (!username || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const userPhoneNum = await User.findOne({ phoneNumber });
  if (userPhoneNum) {
    return res.status(400).json({ message: "Phone Number already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    phoneNumber: {
      value: phoneNumber, 
      isVerified: false, 
    },
  });

  res.status(201).json({ message: "User registered successfully" });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success:false ,message: "Invalid email or password" });
  }


//Create a new  JSON web Token
  const token = jwt.sign(
    { user: { id: user.id, email: user.email } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );

  res.status(200).json({success:true, message: "Login successful", token:token });
});

module.exports = { registerUser, loginUser };
