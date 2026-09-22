const Faculty = require("../models/Faculty");
const User = require("../models/User");
const Department = require("../models/Department");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new faculty profile
// @route   POST /api/faculty
// @access  Private (Admin only)
const createFaculty = asyncHandler(async (req, res) => {
  const {
    userId,
    employeeId,
    department,
    designation,
    qualification,
    specialization,
    officeLocation,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Referenced user account does not exist.",
    });
  }

  const dept = await Department.findById(department);
  if (!dept) {
    return res.status(404).json({
      success: false,
      message: "Referenced department does not exist.",
    });
  }

  const existingEmp = await Faculty.findOne({ employeeId: employeeId.toUpperCase() });
  if (existingEmp) {
    return res.status(409).json({
      success: false,
      message: `Faculty member with Employee ID '${employeeId.toUpperCase()}' already exists.`,
    });
  }

  const existingProfile = await Faculty.findOne({ user: userId });
  if (existingProfile) {
    return res.status(409).json({
      success: false,
      message: "Faculty profile already exists for this user.",
    });
  }

  const faculty = await Faculty.create({
    user: userId,
    employeeId: employeeId.toUpperCase(),
    department,
    designation,
    qualification,
    specialization,
    officeLocation,
  });

  const populatedFaculty = await Faculty.findById(faculty._id)
    .populate("user", "name email phone role isActive")
    .populate("department", "name code");

  res.status(201).json({
    success: true,
    message: "Faculty profile created successfully",
    data: populatedFaculty,
  });
});

// @desc    Get all faculty profiles
// @route   GET /api/faculty
// @access  Private / Public
const getFaculties = asyncHandler(async (req, res) => {
  const { department, search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (department) filter.department = department;
  if (search) {
    filter.employeeId = { $regex: search, $options: "i" };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const total = await Faculty.countDocuments(filter);
  const faculties = await Faculty.find(filter)
    .populate("user", "name email phone role isActive")
    .populate("department", "name code")
    .sort({ designation: 1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: faculties.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    data: faculties,
  });
});

// @desc    Get faculty profile by ID (Faculty ID or User ID)
// @route   GET /api/faculty/:id
// @access  Private / Public
const getFacultyById = asyncHandler(async (req, res) => {
  let faculty = await Faculty.findById(req.params.id)
    .populate("user", "name email phone role isActive")
    .populate("department", "name code");

  // Fallback: check if id passed is the user's ObjectId
  if (!faculty) {
    faculty = await Faculty.findOne({ user: req.params.id })
      .populate("user", "name email phone role isActive")
      .populate("department", "name code");
  }

  if (!faculty) {
    return res.status(404).json({
      success: false,
      message: "Faculty profile not found",
    });
  }

  res.status(200).json({
    success: true,
    data: faculty,
  });
});

// @desc    Update faculty profile
// @route   PUT /api/faculty/:id
// @access  Private (Admin or Faculty Self)
const updateFaculty = asyncHandler(async (req, res) => {
  let faculty = await Faculty.findById(req.params.id);
  if (!faculty) {
    faculty = await Faculty.findOne({ user: req.params.id });
  }

  if (!faculty) {
    return res.status(404).json({
      success: false,
      message: "Faculty profile not found",
    });
  }

  const isSelf = faculty.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isAdmin && !isSelf) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only update your own faculty profile.",
    });
  }

  const {
    employeeId,
    department,
    designation,
    qualification,
    specialization,
    officeLocation,
  } = req.body;

  // Faculty self can update academic profile info
  if (qualification !== undefined) faculty.qualification = qualification;
  if (specialization !== undefined) faculty.specialization = specialization;
  if (officeLocation !== undefined) faculty.officeLocation = officeLocation;

  // Only Admin can update organizational assignment
  if (isAdmin) {
    if (employeeId !== undefined) {
      const empExists = await Faculty.findOne({
        employeeId: employeeId.toUpperCase(),
        _id: { $ne: faculty._id },
      });
      if (empExists) {
        return res.status(409).json({
          success: false,
          message: "Another faculty member already has this employee ID.",
        });
      }
      faculty.employeeId = employeeId.toUpperCase();
    }
    if (department !== undefined) faculty.department = department;
    if (designation !== undefined) faculty.designation = designation;
  }

  await faculty.save();

  const updatedFaculty = await Faculty.findById(faculty._id)
    .populate("user", "name email phone role isActive")
    .populate("department", "name code");

  res.status(200).json({
    success: true,
    message: "Faculty profile updated successfully",
    data: updatedFaculty,
  });
});

// @desc    Delete faculty profile
// @route   DELETE /api/faculty/:id
// @access  Private (Admin only)
const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) {
    return res.status(404).json({
      success: false,
      message: "Faculty profile not found",
    });
  }

  await faculty.deleteOne();

  res.status(200).json({
    success: true,
    message: "Faculty profile deleted successfully",
  });
});

module.exports = {
  createFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};

