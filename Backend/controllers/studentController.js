const Student = require("../models/Student");
const User = require("../models/User");
const Department = require("../models/Department");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new student profile
// @route   POST /api/students
// @access  Private (Admin only)
const createStudent = asyncHandler(async (req, res) => {
  const {
    userId,
    rollNumber,
    department,
    semester,
    batch,
    dateOfBirth,
    gender,
    address,
    guardianName,
    guardianPhone,
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

  const existingRoll = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
  if (existingRoll) {
    return res.status(409).json({
      success: false,
      message: `Student with roll number '${rollNumber.toUpperCase()}' already exists.`,
    });
  }

  const existingProfile = await Student.findOne({ user: userId });
  if (existingProfile) {
    return res.status(409).json({
      success: false,
      message: "Student profile already exists for this user.",
    });
  }

  const student = await Student.create({
    user: userId,
    rollNumber: rollNumber.toUpperCase(),
    department,
    semester: semester || 1,
    batch,
    dateOfBirth,
    gender,
    address,
    guardianName,
    guardianPhone,
  });

  const populatedStudent = await Student.findById(student._id)
    .populate("user", "name email phone role isActive")
    .populate("department", "name code");

  res.status(201).json({
    success: true,
    message: "Student profile created successfully",
    data: populatedStudent,
  });
});

// @desc    Get all student profiles
// @route   GET /api/students
// @access  Private (Admin, Faculty)
const getStudents = asyncHandler(async (req, res) => {
  const { department, semester, search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (department) filter.department = department;
  if (semester) filter.semester = Number(semester);
  if (search) {
    filter.rollNumber = { $regex: search, $options: "i" };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const total = await Student.countDocuments(filter);
  const students = await Student.find(filter)
    .populate("user", "name email phone role isActive")
    .populate("department", "name code")
    .sort({ rollNumber: 1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: students.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    data: students,
  });
});

// @desc    Get student profile by ID (Student ID or User ID)
// @route   GET /api/students/:id
// @access  Private (Admin, Faculty, or Student Self)
const getStudentById = asyncHandler(async (req, res) => {
  let student = await Student.findById(req.params.id)
    .populate("user", "name email phone role isActive")
    .populate("department", "name code");

  // Fallback: check if id passed is the user's ObjectId
  if (!student) {
    student = await Student.findOne({ user: req.params.id })
      .populate("user", "name email phone role isActive")
      .populate("department", "name code");
  }

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  }

  const isSelf = student.user && student.user._id.toString() === req.user._id.toString();
  const isAuthorizedRole = ["admin", "faculty"].includes(req.user.role);

  if (!isAuthorizedRole && !isSelf) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only view your own student profile.",
    });
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc    Update student profile
// @route   PUT /api/students/:id
// @access  Private (Admin or Student Self)
const updateStudent = asyncHandler(async (req, res) => {
  let student = await Student.findById(req.params.id);
  if (!student) {
    student = await Student.findOne({ user: req.params.id });
  }

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  }

  const isSelf = student.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isAdmin && !isSelf) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only update your own student profile.",
    });
  }

  const {
    rollNumber,
    department,
    semester,
    batch,
    dateOfBirth,
    gender,
    address,
    guardianName,
    guardianPhone,
  } = req.body;

  // Student can only update personal / guardian info
  if (address !== undefined) student.address = address;
  if (guardianName !== undefined) student.guardianName = guardianName;
  if (guardianPhone !== undefined) student.guardianPhone = guardianPhone;
  if (gender !== undefined) student.gender = gender;
  if (dateOfBirth !== undefined) student.dateOfBirth = dateOfBirth;

  // Only Admin can update academic records
  if (isAdmin) {
    if (rollNumber !== undefined) {
      const rollExists = await Student.findOne({
        rollNumber: rollNumber.toUpperCase(),
        _id: { $ne: student._id },
      });
      if (rollExists) {
        return res.status(409).json({
          success: false,
          message: "Another student already has this roll number.",
        });
      }
      student.rollNumber = rollNumber.toUpperCase();
    }
    if (department !== undefined) student.department = department;
    if (semester !== undefined) student.semester = semester;
    if (batch !== undefined) student.batch = batch;
  }

  await student.save();

  const updatedStudent = await Student.findById(student._id)
    .populate("user", "name email phone role isActive")
    .populate("department", "name code");

  res.status(200).json({
    success: true,
    message: "Student profile updated successfully",
    data: updatedStudent,
  });
});

// @desc    Delete student profile
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    message: "Student profile deleted successfully",
  });
});

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

