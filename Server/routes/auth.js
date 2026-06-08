const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!email || !password || !name) {
  return res.status(400).json({
    message: "All fields are required",
  });
}
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!email || !password) {
  return res.status(400).json({
    message: "Email and password required",
  });
}
    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ME ROUTE - Get current user from database
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user contains the user ID from token
    const user = await User.findById(req.user).select("-password");
    // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      userId: user._id,
      email: user.email,
      name: user.name,
      message: "User data fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
