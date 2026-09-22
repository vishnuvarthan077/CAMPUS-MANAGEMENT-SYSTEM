const Company = require("../models/Company");
const Drive = require("../models/Drive");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create a new company
// @route   POST /api/companies
// @access  Public
const createCompany = asyncHandler(async (req, res) => {
  const { name, industry, website, contactEmail, contactPhone, address, description } = req.body;

  const company = await Company.create({
    name,
    industry,
    website,
    contactEmail,
    contactPhone,
    address,
    description,
  });

  res.status(201).json({ success: true, data: company });
});

// @desc    Get all companies (supports search & active filter)
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const { search, isActive } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { industry: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const companies = await Company.find(filter).sort({ name: 1 });
  const driveCounts = await Drive.aggregate([
    { $match: { company: { $in: companies.map((c) => c._id) } } },
    { $group: { _id: "$company", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(driveCounts.map((d) => [d._id.toString(), d.count]));

  const data = companies.map((company) => ({
    ...company.toObject(),
    driveCount: countMap.get(company._id.toString()) || 0,
  }));

  res.status(200).json({ success: true, count: data.length, data });
});

// @desc    Get a single company by id (with its drives)
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate({
    path: "drives",
    select: "role status ctc driveDate",
    options: { sort: { driveDate: -1 } },
  });

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  res.status(200).json({ success: true, data: company });
});

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Public
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  res.status(200).json({ success: true, data: company });
});

// @desc    Delete a company (blocked if drives still reference it)
// @route   DELETE /api/companies/:id
// @access  Public
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const driveCount = await Drive.countDocuments({ company: company._id });
  if (driveCount > 0) {
    res.status(409);
    throw new Error(`Cannot delete company: ${driveCount} drive(s) are still linked to it`);
  }

  await company.deleteOne();

  res.status(200).json({ success: true, message: "Company deleted successfully" });
});

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
