const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [30, "Invoice number cannot exceed 30 characters"],
    },
    title: {
      type: String,
      required: [true, "Fee title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Fee amount is required"],
      min: [1, "Amount must be greater than zero"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "PAID", "OVERDUE", "CANCELLED"],
        message: "{VALUE} is not a valid fee status. Allowed: PENDING, PAID, OVERDUE, CANCELLED",
      },
      default: "PENDING",
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Credit Card", "Debit Card", "Net Banking", "Mock Gateway", "Cash"],
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

feeSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model("Fee", feeSchema);

