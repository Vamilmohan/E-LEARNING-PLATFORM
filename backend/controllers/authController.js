const authService = require('../services/authService');
const User = require('../models/User');

// Controller handlers use authService for business logic

// @desc    Send OTP for signup
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const result = await authService.sendSignupOtp(req.body);
    res.json(result);
  } catch (error) {
    console.error('sendOTP error:', error);
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Send OTP for forgot password
// @route   POST /api/auth/send-forgot-otp
// @access  Public
exports.sendForgotPasswordOtp = async (req, res) => {
  try {
    const result = await authService.sendForgotPasswordOtp(req.body);
    res.json(result);
  } catch (error) {
    console.error('sendForgotPasswordOtp error:', error);
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Verify OTP for forgot password
// @route   POST /api/auth/verify-forgot-otp
// @access  Public
exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const result = await authService.verifyForgotPasswordOtp(req.body);
    res.json(result);
  } catch (error) {
    console.error('verifyForgotPasswordOtp error:', error);
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.json(result);
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP and complete signup
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const result = await authService.verifySignupOtp(req.body);
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('verifyOTP error:', error);
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json(result);
  } catch (error) {
    console.error('login error:', error);
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = exports;