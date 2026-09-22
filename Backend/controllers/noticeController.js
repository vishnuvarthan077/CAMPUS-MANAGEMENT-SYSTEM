const Notice = require("../models/Notice");
const Department = require("../models/Department");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Public
const createNotice = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    category,
    priority,
    targetAudience,
    department,
    postedBy,
    isPinned,
    expiryDate,
  } = req.body;

  if (department) {
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      res.status(400);
      throw new Error("Referenced department does not exist");
    }
  }

  const notice = await Notice.create({
    title,
    content,
    category,
    priority,
    targetAudience,
    department: department || null,
    postedBy,
    isPinned,
    expiryDate: expiryDate || undefined,
  });

  res.status(201).json({ success: true, data: notice });
});

// @desc    Get all notices (supports filtering & search, pinned notices first)
// @route   GET /api/notices
// @access  Public
const getNotices = asyncHandler(async (req, res) => {
  const { category, priority, targetAudience, department, search, isActive, includeExpired } =
    req.query;
  const filter = {};
  const andConditions = [];

  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (targetAudience) filter.targetAudience = targetAudience;
  if (department) filter.department = department;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  if (includeExpired !== "true") {
    andConditions.push({
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: null }, { expiryDate: { $gte: new Date() } }],
    });
  }

  if (search) {
    andConditions.push({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    });
  }

  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  const notices = await Notice.find(filter)
    .populate("department", "name code")
    .sort({ isPinned: -1, createdAt: -1 });

  res.status(200).json({ success: true, count: notices.length, data: notices });
});

// @desc    Get a single notice by id
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate("department", "name code");

  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }

  res.status(200).json({ success: true, data: notice });
});

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Public
const updateNotice = asyncHandler(async (req, res) => {
  if (req.body.department) {
    const departmentExists = await Department.findById(req.body.department);
    if (!departmentExists) {
      res.status(400);
      throw new Error("Referenced department does not exist");
    }
  }

  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("department", "name code");

  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }

  res.status(200).json({ success: true, data: notice });
});

// @desc    Toggle the pinned state of a notice
// @route   PATCH /api/notices/:id/pin
// @access  Public
const togglePinNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }

  notice.isPinned = !notice.isPinned;
  await notice.save();

  res.status(200).json({ success: true, data: notice });
});

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Public
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }

  await notice.deleteOne();

  res.status(200).json({ success: true, message: "Notice deleted successfully" });
});

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  togglePinNotice,
  deleteNotice,
};
