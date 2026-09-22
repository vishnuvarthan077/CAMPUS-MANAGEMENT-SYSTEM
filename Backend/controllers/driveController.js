const Drive = require("../models/Drive");
const Company = require("../models/Company");
const Placement = require("../models/Placement");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new placement drive
// @route   POST /api/drives
// @access  Public
const createDrive = asyncHandler(async (req, res) => {
  const {
    company,
    role,
    driveType,
    ctc,
    minCgpa,
    maxBacklogs,
    allowedDepartments,
    driveDate,
    applicationDeadline,
    rounds,
    status,
    description,
  } = req.body;

  const companyExists = await Company.findById(company);
  if (!companyExists) {
    res.status(400);
    throw new Error("Referenced company does not exist");
  }

  const drive = await Drive.create({
    company,
    role,
    driveType,
    ctc,
    minCgpa,
    maxBacklogs,
    allowedDepartments,
    driveDate,
    applicationDeadline,
    rounds,
    status,
    description,
  });

  res.status(201).json({ success: true, data: drive });
});

// @desc    Get all drives (supports filtering by status, company, department, search)
// @route   GET /api/drives
// @access  Public
const getDrives = asyncHandler(async (req, res) => {
  const { status, company, department, search } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (company) filter.company = company;
  if (department) filter.allowedDepartments = department;

  if (search) {
    filter.role = { $regex: search, $options: "i" };
  }

  const drives = await Drive.find(filter)
    .populate("company", "name industry")
    .populate("allowedDepartments", "name code")
    .sort({ driveDate: 1 });

  const placementCounts = await Placement.aggregate([
    { $match: { drive: { $in: drives.map((d) => d._id) } } },
    { $group: { _id: "$drive", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(placementCounts.map((p) => [p._id.toString(), p.count]));

  const data = drives.map((drive) => ({
    ...drive.toObject(),
    placementCount: countMap.get(drive._id.toString()) || 0,
  }));

  res.status(200).json({ success: true, count: data.length, data });
});

// @desc    Get a single drive by id (with its placements)
// @route   GET /api/drives/:id
// @access  Public
const getDriveById = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id)
    .populate("company", "name industry contactEmail")
    .populate("allowedDepartments", "name code")
    .populate({
      path: "placements",
      select: "studentName rollNumber department ctcOffered status",
      populate: { path: "department", select: "name code" },
    });

  if (!drive) {
    res.status(404);
    throw new Error("Drive not found");
  }

  res.status(200).json({ success: true, data: drive });
});

// @desc    Update a drive
// @route   PUT /api/drives/:id
// @access  Public
const updateDrive = asyncHandler(async (req, res) => {
  if (req.body.company) {
    const companyExists = await Company.findById(req.body.company);
    if (!companyExists) {
      res.status(400);
      throw new Error("Referenced company does not exist");
    }
  }

  const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("company", "name industry")
    .populate("allowedDepartments", "name code");

  if (!drive) {
    res.status(404);
    throw new Error("Drive not found");
  }

  res.status(200).json({ success: true, data: drive });
});

// @desc    Delete a drive (blocked if placements still reference it)
// @route   DELETE /api/drives/:id
// @access  Public
const deleteDrive = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    res.status(404);
    throw new Error("Drive not found");
  }

  const placementCount = await Placement.countDocuments({ drive: drive._id });
  if (placementCount > 0) {
    res.status(409);
    throw new Error(
      `Cannot delete drive: ${placementCount} placement record(s) are still linked to it`
    );
  }

  await drive.deleteOne();

  res.status(200).json({ success: true, message: "Drive deleted successfully" });
});

module.exports = {
  createDrive,
  getDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
};
