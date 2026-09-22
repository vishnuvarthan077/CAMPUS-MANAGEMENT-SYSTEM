const Placement = require("../models/Placement");
const Drive = require("../models/Drive");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Record a new student placement against a drive
// @route   POST /api/placements
// @access  Public
const createPlacement = asyncHandler(async (req, res) => {
  const { drive, studentName, rollNumber, department, ctcOffered, status, placementDate } =
    req.body;

  const driveExists = await Drive.findById(drive);
  if (!driveExists) {
    res.status(400);
    throw new Error("Referenced drive does not exist");
  }

  const placement = await Placement.create({
    drive,
    studentName,
    rollNumber,
    department,
    ctcOffered,
    status,
    placementDate,
  });

  const populated = await placement.populate([
    { path: "department", select: "name code" },
    { path: "drive", select: "role company", populate: { path: "company", select: "name" } },
  ]);

  res.status(201).json({ success: true, data: populated });
});

// @desc    Get all placement records (supports filtering by drive, department, status, search)
// @route   GET /api/placements
// @access  Public
const getPlacements = asyncHandler(async (req, res) => {
  const { drive, department, status, search } = req.query;
  const filter = {};

  if (drive) filter.drive = drive;
  if (department) filter.department = department;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { studentName: { $regex: search, $options: "i" } },
      { rollNumber: { $regex: search, $options: "i" } },
    ];
  }

  const placements = await Placement.find(filter)
    .populate("department", "name code")
    .populate({ path: "drive", select: "role company", populate: { path: "company", select: "name" } })
    .sort({ ctcOffered: -1 });

  res.status(200).json({ success: true, count: placements.length, data: placements });
});

// @desc    Get a single placement record by id
// @route   GET /api/placements/:id
// @access  Public
const getPlacementById = asyncHandler(async (req, res) => {
  const placement = await Placement.findById(req.params.id)
    .populate("department", "name code")
    .populate({ path: "drive", select: "role company", populate: { path: "company", select: "name" } });

  if (!placement) {
    res.status(404);
    throw new Error("Placement record not found");
  }

  res.status(200).json({ success: true, data: placement });
});

// @desc    Get aggregate placement statistics for the dashboard
// @route   GET /api/placements/stats
// @access  Public
const getPlacementStats = asyncHandler(async (req, res) => {
  const [totals, byStatus, topRecruiters] = await Promise.all([
    Placement.aggregate([
      {
        $group: {
          _id: null,
          totalPlacements: { $sum: 1 },
          highestCtc: { $max: "$ctcOffered" },
          averageCtc: { $avg: "$ctcOffered" },
        },
      },
    ]),
    Placement.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Placement.aggregate([
      {
        $lookup: { from: "drives", localField: "drive", foreignField: "_id", as: "drive" },
      },
      { $unwind: "$drive" },
      {
        $lookup: {
          from: "companies",
          localField: "drive.company",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      { $group: { _id: "$company.name", placedCount: { $sum: 1 } } },
      { $sort: { placedCount: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const totalDrives = await Drive.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      totalPlacements: totals[0]?.totalPlacements || 0,
      highestCtc: totals[0]?.highestCtc || 0,
      averageCtc: totals[0]?.averageCtc ? Number(totals[0].averageCtc.toFixed(2)) : 0,
      totalDrives,
      byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      topRecruiters: topRecruiters.map((r) => ({ company: r._id, placedCount: r.placedCount })),
    },
  });
});

// @desc    Update a placement record
// @route   PUT /api/placements/:id
// @access  Public
const updatePlacement = asyncHandler(async (req, res) => {
  const placement = await Placement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("department", "name code")
    .populate({ path: "drive", select: "role company", populate: { path: "company", select: "name" } });

  if (!placement) {
    res.status(404);
    throw new Error("Placement record not found");
  }

  res.status(200).json({ success: true, data: placement });
});

// @desc    Delete a placement record
// @route   DELETE /api/placements/:id
// @access  Public
const deletePlacement = asyncHandler(async (req, res) => {
  const placement = await Placement.findById(req.params.id);

  if (!placement) {
    res.status(404);
    throw new Error("Placement record not found");
  }

  await placement.deleteOne();

  res.status(200).json({ success: true, message: "Placement record deleted successfully" });
});

module.exports = {
  createPlacement,
  getPlacements,
  getPlacementById,
  getPlacementStats,
  updatePlacement,
  deletePlacement,
};
