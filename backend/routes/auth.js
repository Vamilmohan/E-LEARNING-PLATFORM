const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, login, logout, getMe, sendForgotPasswordOtp, verifyForgotPasswordOtp, resetPassword } = require('../controllers/authController');
const auth = require('../middlewares/auth');

// @route   POST /api/auth/send-otp
// @desc    Send OTP for signup
// @access  Public
router.post('/send-otp', sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and complete signup
// @access  Public
router.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/send-forgot-otp
// @desc    Send OTP for forgot password
// @access  Public
router.post('/send-forgot-otp', sendForgotPasswordOtp);

// @route   POST /api/auth/verify-forgot-otp
// @desc    Verify OTP for forgot password
// @access  Public
router.post('/verify-forgot-otp', verifyForgotPasswordOtp);

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', resetPassword);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', logout);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;