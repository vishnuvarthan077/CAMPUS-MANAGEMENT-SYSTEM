const User = require("../models/User");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new user
// @route   POST /api/users
// @access  Private (Admin only)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, isActive } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role ? role.toLowerCase() : "student",
    phone: phone || null,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Get all users with search, filtering & pagination
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = asyncHandler(async (req, res) => {
  const { search, role, status, isActive, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    filter.role = role.toLowerCase();
  }

  if (status !== undefined) {
    filter.isActive = status === "active" || status === "true";
  } else if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    data: users,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin or Self)
const getUserById = asyncHandler(async (req, res) => {
  const isSelf = req.user._id.toString() === req.params.id;
  const isAdmin = req.user.role === "admin";

  if (!isAdmin && !isSelf) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only view your own profile.",
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or Self)
const updateUser = asyncHandler(async (req, res) => {
  const isSelf = req.user._id.toString() === req.params.id;
  const isAdmin = req.user.role === "admin";

  if (!isAdmin && !isSelf) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only update your own profile.",
    });
  }

  const user = await User.findById(req.params.id).select("+password");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { name, email, password, role, phone, isActive } = req.body;

  if (email && email.toLowerCase() !== user.email) {
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    user.email = email.toLowerCase();
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;

  // Only Admin can change role and active status
  if (isAdmin) {
    if (role !== undefined) user.role = role.toLowerCase();
    if (isActive !== undefined) user.isActive = isActive;
  }

  if (password) {
    user.password = password; // Pre-save hook will hash it
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Administrators cannot delete their own account.",
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Clean up associated student or faculty profile
  await Student.deleteOne({ user: user._id });
  await Faculty.deleteOne({ user: user._id });

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

