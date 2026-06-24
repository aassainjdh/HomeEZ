const User = require('../models/User');
const Provider = require('../models/Provider');
const generateToken = require('../utils/jwt');
const crypto = require('crypto');

// Memory store for password reset tokens (simple mockup)
const resetTokens = new Map();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone: phone || '',
      address: address || ''
    });

    if (user) {
      // If provider, create provider document
      if (user.role === 'provider') {
        await Provider.create({
          userId: user._id,
          services: [],
          experience: 0,
          description: '',
          rating: 5.0,
          availability: true,
          verificationStatus: 'pending'
        });
      }

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    let providerData = null;
    if (user.role === 'provider') {
      providerData = await Provider.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      },
      provider: providerData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(444); // Keep it standard or return a 404
      res.status(404);
      throw new Error('No user found with that email');
    }

    // Generate 6-digit random code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in memory with 10-minute expiry
    resetTokens.set(email, {
      code: resetCode,
      expire: Date.now() + 10 * 60 * 1000
    });

    console.log(`[HomeEZ Auth] Password reset request for ${email}. Reset Code: ${resetCode}`);

    res.json({
      success: true,
      message: 'Reset code generated successfully.',
      // Return the code directly in development so users can test it easily!
      resetCode: resetCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    const record = resetTokens.get(email);

    if (!record) {
      res.status(400);
      throw new Error('Invalid or expired reset code');
    }

    if (record.code !== code || record.expire < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired reset code');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Save new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    // Remove token from memory
    resetTokens.delete(email);

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword
};
