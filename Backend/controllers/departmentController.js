const Department = require("../models/Department");
const Course = require("../models/Course");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new department
// @route   POST /api/departments
// @access  Public
const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, description, headOfDepartment, establishedYear } = req.body;

  const department = await Department.create({
    name,
    code,
    description,
    headOfDepartment,
    establishedYear,
  });

  res.status(201).json({ success: true, data: department });
});

// @desc    Get all departments (supports search & active filter)
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
  const { search, isActive } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const departments = await Department.find(filter).sort({ name: 1 });

  res.status(200).json({ success: true, count: departments.length, data: departments });
});

// @desc    Get a single department by id (with its courses)
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id).populate({
    path: "courses",
    select: "name code credits semester courseType isActive",
  });

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  res.status(200).json({ success: true, data: department });
});

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Public
const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  res.status(200).json({ success: true, data: department });
});

// @desc    Delete a department (blocked if courses still reference it)
// @route   DELETE /api/departments/:id
// @access  Public
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  const courseCount = await Course.countDocuments({ department: department._id });
  if (courseCount > 0) {
    res.status(409);
    throw new Error(
      `Cannot delete department: ${courseCount} course(s) are still assigned to it`
    );
  }

  await department.deleteOne();

  res.status(200).json({ success: true, message: "Department deleted successfully" });
});

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
