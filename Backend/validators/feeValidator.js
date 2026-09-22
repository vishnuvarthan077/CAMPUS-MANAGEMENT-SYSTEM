const mongoose = require("mongoose");

const validStatuses = ["PENDING", "PAID", "OVERDUE", "CANCELLED"];
const validPaymentMethods = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Mock Gateway",
  "Cash",
];

const validateCreateFee = (req) => {
  const errors = [];
  const { student, invoiceNumber, title, amount, dueDate } = req.body;

  if (!student || !mongoose.Types.ObjectId.isValid(student)) {
    errors.push({ field: "student", message: "Valid Student/User ObjectId is required" });
  }

  if (!invoiceNumber || typeof invoiceNumber !== "string" || invoiceNumber.trim().length === 0) {
    errors.push({ field: "invoiceNumber", message: "Invoice number is required" });
  }

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push({ field: "title", message: "Fee title is required" });
  }

  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push({ field: "amount", message: "Amount must be a positive number greater than 0" });
  }

  if (!dueDate || isNaN(new Date(dueDate).getTime())) {
    errors.push({ field: "dueDate", message: "A valid due date is required" });
  }

  return errors;
};

const validateUpdateFee = (req) => {
  const errors = [];
  const { amount, dueDate, status } = req.body;

  if (amount !== undefined && (isNaN(Number(amount)) || Number(amount) <= 0)) {
    errors.push({ field: "amount", message: "Amount must be a positive number greater than 0" });
  }

  if (dueDate !== undefined && isNaN(new Date(dueDate).getTime())) {
    errors.push({ field: "dueDate", message: "A valid due date is required" });
  }

  if (status !== undefined && !validStatuses.includes(String(status).toUpperCase())) {
    errors.push({
      field: "status",
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  return errors;
};

const validatePayFee = (req) => {
  const errors = [];
  const { paymentMethod } = req.body;

  if (paymentMethod !== undefined && !validPaymentMethods.includes(paymentMethod)) {
    errors.push({
      field: "paymentMethod",
      message: `Payment method must be one of: ${validPaymentMethods.join(", ")}`,
    });
  }

  return errors;
};

module.exports = {
  validateCreateFee,
  validateUpdateFee,
  validatePayFee,
};

