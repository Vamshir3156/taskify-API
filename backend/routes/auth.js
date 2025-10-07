const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginUser);

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get("/me", auth, getMe);

module.exports = router;
