const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long.",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }

  // Create new user (password is automatically hashed via pre-save hook)
  const userData = {
    name,
    email: email.toLowerCase(),
    password,
  };

  if (role) {
    userData.role = role.toLowerCase();
  }

  const user = await User.create(userData);

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in database for session tracking
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Login user & get tokens
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password.",
    });
  }

  // Find user and explicitly select password and refreshToken
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password +refreshToken"
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: "User account is deactivated. Please contact an administrator.",
    });
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  // Generate fresh access and refresh tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Update refresh token in database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required.",
    });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh token has expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token.",
    });
  }

  // Find user and check stored refresh token
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User account no longer exists.",
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: "User account is deactivated.",
    });
  }

  // Validate that token matches currently stored token in DB
  if (!user.refreshToken || user.refreshToken !== refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is invalid or has been revoked.",
    });
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user);

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    accessToken: newAccessToken,
    refreshToken,
  });
});

// @desc    Logout user & invalidate refresh token
// @route   POST /api/auth/logout
// @access  Public / Protected
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  // If refreshToken is provided in request body, invalidate matching user
  if (refreshToken) {
    const user = await User.findOne({ refreshToken }).select("+refreshToken");
    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }
  }

  // If user is authenticated via Bearer token, invalidate user session
  if (req.user) {
    const user = await User.findById(req.user._id).select("+refreshToken");
    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};

