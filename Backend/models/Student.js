const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, "Roll number cannot exceed 20 characters"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be at least 1"],
      max: [8, "Semester cannot exceed 8"],
      default: 1,
    },
    batch: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    guardianName: {
      type: String,
      trim: true,
      maxlength: [100, "Guardian name cannot exceed 100 characters"],
    },
    guardianPhone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

studentSchema.index({ department: 1 });

module.exports = mongoose.model("Student", studentSchema);
