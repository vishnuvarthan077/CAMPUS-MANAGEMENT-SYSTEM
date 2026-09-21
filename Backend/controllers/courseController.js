const Course = require("../models/Course");
const Department = require("../models/Department");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public
const createCourse = asyncHandler(async (req, res) => {
  const { name, code, department, description, credits, semester, courseType, seatsAvailable } =
    req.body;

  const departmentExists = await Department.findById(department);
  if (!departmentExists) {
    res.status(400);
    throw new Error("Referenced department does not exist");
  }

  const course = await Course.create({
    name,
    code,
    department,
    description,
    credits,
    semester,
    courseType,
    seatsAvailable,
  });

  res.status(201).json({ success: true, data: course });
});

// @desc    Get all courses (supports filtering by department, semester, type, search)
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { department, semester, courseType, search, isActive } = req.query;
  const filter = {};

  if (department) filter.department = department;
  if (semester) filter.semester = semester;
  if (courseType) filter.courseType = courseType;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
    ];
  }

  const courses = await Course.find(filter)
    .populate("department", "name code")
    .sort({ semester: 1, name: 1 });

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc    Get a single course by id
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("department", "name code");

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json({ success: true, data: course });
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Public
const updateCourse = asyncHandler(async (req, res) => {
  if (req.body.department) {
    const departmentExists = await Department.findById(req.body.department);
    if (!departmentExists) {
      res.status(400);
      throw new Error("Referenced department does not exist");
    }
  }

  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("department", "name code");

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json({ success: true, data: course });
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Public
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  await course.deleteOne();

  res.status(200).json({ success: true, message: "Course deleted successfully" });
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
