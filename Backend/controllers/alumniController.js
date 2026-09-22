const Alumni = require("../models/Alumni");
const Department = require("../models/Department");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Register a new alumni profile
// @route   POST /api/alumni
// @access  Public
const registerAlumni = asyncHandler(async (req, res) => {
  const {
    fullName,
    rollNumber,
    email,
    phone,
    department,
    degree,
    graduationYear,
    currentCompany,
    designation,
    currentLocation,
    linkedinUrl,
    bio,
    skills,
  } = req.body;

  const departmentExists = await Department.findById(department);
  if (!departmentExists) {
    res.status(400);
    throw new Error("Referenced department does not exist");
  }

  const alumni = await Alumni.create({
    fullName,
    rollNumber,
    email,
    phone,
    department,
    degree,
    graduationYear,
    currentCompany,
    designation,
    currentLocation,
    linkedinUrl,
    bio,
    skills,
  });

  const populated = await alumni.populate("department", "name code");

  res.status(201).json({ success: true, data: populated });
});

// @desc    Get the alumni directory (supports search & filtering)
// @route   GET /api/alumni
// @access  Public
const getAlumni = asyncHandler(async (req, res) => {
  const { search, department, graduationYear, isVerified } = req.query;
  const filter = {};

  if (department) filter.department = department;
  if (graduationYear) filter.graduationYear = Number(graduationYear);
  if (isVerified !== undefined) filter.isVerified = isVerified === "true";

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { currentCompany: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } },
      { rollNumber: { $regex: search, $options: "i" } },
    ];
  }

  const alumni = await Alumni.find(filter)
    .populate("department", "name code")
    .sort({ graduationYear: -1, fullName: 1 });

  res.status(200).json({ success: true, count: alumni.length, data: alumni });
});

// @desc    Get a single alumni profile by id
// @route   GET /api/alumni/:id
// @access  Public
const getAlumniById = asyncHandler(async (req, res) => {
  const alumni = await Alumni.findById(req.params.id).populate("department", "name code");

  if (!alumni) {
    res.status(404);
    throw new Error("Alumni profile not found");
  }

  res.status(200).json({ success: true, data: alumni });
});

// @desc    Update an alumni profile
// @route   PUT /api/alumni/:id
// @access  Public
const updateAlumni = asyncHandler(async (req, res) => {
  if (req.body.department) {
    const departmentExists = await Department.findById(req.body.department);
    if (!departmentExists) {
      res.status(400);
      throw new Error("Referenced department does not exist");
    }
  }

  const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("department", "name code");

  if (!alumni) {
    res.status(404);
    throw new Error("Alumni profile not found");
  }

  res.status(200).json({ success: true, data: alumni });
});

// @desc    Toggle the verified state of an alumni profile
// @route   PATCH /api/alumni/:id/verify
// @access  Public
const toggleVerifyAlumni = asyncHandler(async (req, res) => {
  const alumni = await Alumni.findById(req.params.id);

  if (!alumni) {
    res.status(404);
    throw new Error("Alumni profile not found");
  }

  alumni.isVerified = !alumni.isVerified;
  await alumni.save();

  res.status(200).json({ success: true, data: alumni });
});

// @desc    Delete an alumni profile
// @route   DELETE /api/alumni/:id
// @access  Public
const deleteAlumni = asyncHandler(async (req, res) => {
  const alumni = await Alumni.findById(req.params.id);

  if (!alumni) {
    res.status(404);
    throw new Error("Alumni profile not found");
  }

  await alumni.deleteOne();

  res.status(200).json({ success: true, message: "Alumni profile deleted successfully" });
});

module.exports = {
  registerAlumni,
  getAlumni,
  getAlumniById,
  updateAlumni,
  toggleVerifyAlumni,
  deleteAlumni,
};
