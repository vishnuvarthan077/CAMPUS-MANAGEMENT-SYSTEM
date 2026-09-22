const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, "Employee ID cannot exceed 20 characters"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: [100, "Designation cannot exceed 100 characters"],
    },
    qualification: {
      type: String,
      trim: true,
      maxlength: [100, "Qualification cannot exceed 100 characters"],
    },
    specialization: {
      type: String,
      trim: true,
      maxlength: [200, "Specialization cannot exceed 200 characters"],
    },
    officeLocation: {
      type: String,
      trim: true,
      maxlength: [100, "Office location cannot exceed 100 characters"],
    },
  },
  { timestamps: true }
);

facultySchema.index({ department: 1 });

module.exports = mongoose.model("Faculty", facultySchema);
