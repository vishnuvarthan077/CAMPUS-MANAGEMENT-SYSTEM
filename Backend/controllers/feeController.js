const Fee = require("../models/Fee");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { processMockPayment } = require("../services/paymentService");

// @desc    Create a new fee invoice
// @route   POST /api/fees
// @access  Private (Admin only)
const createFee = asyncHandler(async (req, res) => {
  const { student, invoiceNumber, title, description, amount, dueDate, status } = req.body;

  const studentUser = await User.findById(student);
  if (!studentUser) {
    return res.status(404).json({
      success: false,
      message: "Referenced student user does not exist.",
    });
  }

  const existingInvoice = await Fee.findOne({ invoiceNumber: invoiceNumber.toUpperCase() });
  if (existingInvoice) {
    return res.status(409).json({
      success: false,
      message: `Invoice number '${invoiceNumber.toUpperCase()}' already exists.`,
    });
  }

  const fee = await Fee.create({
    student,
    invoiceNumber: invoiceNumber.toUpperCase(),
    title,
    description,
    amount: Number(amount),
    dueDate: new Date(dueDate),
    status: status ? status.toUpperCase() : "PENDING",
  });

  const populatedFee = await Fee.findById(fee._id).populate("student", "name email phone role");

  res.status(201).json({
    success: true,
    message: "Fee invoice created successfully",
    data: populatedFee,
  });
});

// @desc    Get all fee invoices (Admin sees all, Student sees own)
// @route   GET /api/fees
// @access  Private (Admin, Student)
const getFees = asyncHandler(async (req, res) => {
  const { status, student, search, page = 1, limit = 10 } = req.query;

  const filter = {};

  // If role is student, strictly restrict to own fees
  if (req.user.role === "student") {
    filter.student = req.user._id;
  } else if (student) {
    filter.student = student;
  }

  if (status) {
    filter.status = status.toUpperCase();
  }

  if (search) {
    filter.invoiceNumber = { $regex: search, $options: "i" };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const total = await Fee.countDocuments(filter);
  const fees = await Fee.find(filter)
    .populate("student", "name email phone role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: fees.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    data: fees,
  });
});

// @desc    Get single fee invoice by ID
// @route   GET /api/fees/:id
// @access  Private (Admin, Student owner)
const getFeeById = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id).populate("student", "name email phone role");

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: "Fee invoice not found",
    });
  }

  const isOwner = fee.student && fee.student._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only view your own fee invoices.",
    });
  }

  res.status(200).json({
    success: true,
    data: fee,
  });
});

// @desc    Update fee invoice
// @route   PUT /api/fees/:id
// @access  Private (Admin only)
const updateFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id);

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: "Fee invoice not found",
    });
  }

  const { title, description, amount, dueDate, status } = req.body;

  if (title !== undefined) fee.title = title;
  if (description !== undefined) fee.description = description;
  if (amount !== undefined) fee.amount = Number(amount);
  if (dueDate !== undefined) fee.dueDate = new Date(dueDate);
  if (status !== undefined) fee.status = status.toUpperCase();

  await fee.save();

  const updatedFee = await Fee.findById(fee._id).populate("student", "name email phone role");

  res.status(200).json({
    success: true,
    message: "Fee invoice updated successfully",
    data: updatedFee,
  });
});

// @desc    Delete fee invoice
// @route   DELETE /api/fees/:id
// @access  Private (Admin only)
const deleteFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id);

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: "Fee invoice not found",
    });
  }

  if (fee.status === "PAID") {
    return res.status(400).json({
      success: false,
      message: "Cannot delete an invoice that has already been paid.",
    });
  }

  await fee.deleteOne();

  res.status(200).json({
    success: true,
    message: "Fee invoice deleted successfully",
  });
});

// @desc    Pay fee invoice via Mock Payment Gateway
// @route   POST /api/fees/:id/pay
// @access  Private (Student owner or Admin)
const payFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id);

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: "Fee invoice not found",
    });
  }

  const isOwner = fee.student.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only pay your own fee invoices.",
    });
  }

  const { paymentMethod, simulateFailure } = req.body;

  const result = await processMockPayment(fee, {
    paymentMethod: paymentMethod || "Mock Gateway",
    simulateFailure: Boolean(simulateFailure),
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
});

// @desc    Get payment receipt for an invoice
// @route   GET /api/fees/:id/payment
// @access  Private (Student owner or Admin)
const getFeePayment = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id).populate("student", "name email phone");

  if (!fee) {
    return res.status(404).json({
      success: false,
      message: "Fee invoice not found",
    });
  }

  const isOwner = fee.student && fee.student._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isAdmin && !isOwner) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only view payment receipts for your own invoices.",
    });
  }

  if (fee.status !== "PAID" || !fee.transactionId) {
    return res.status(400).json({
      success: false,
      message: "This invoice has not been paid yet. No payment receipt is available.",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      invoiceId: fee._id,
      invoiceNumber: fee.invoiceNumber,
      title: fee.title,
      amount: fee.amount,
      paymentMethod: fee.paymentMethod,
      transactionId: fee.transactionId,
      paidAt: fee.paidAt,
      status: "SUCCESS",
      isSimulation: true,
      student: {
        id: fee.student._id,
        name: fee.student.name,
        email: fee.student.email,
      },
    },
  });
});

module.exports = {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  payFee,
  getFeePayment,
};

