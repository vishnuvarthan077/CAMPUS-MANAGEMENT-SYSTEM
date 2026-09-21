const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      maxlength: [100, "Course name cannot exceed 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
      unique: true,
      uppercase: true,
      maxlength: [15, "Course code cannot exceed 15 characters"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Course must belong to a department"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    credits: {
      type: Number,
      required: [true, "Credits are required"],
      min: [1, "Credits must be at least 1"],
      max: [10, "Credits cannot exceed 10"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be at least 1"],
      max: [8, "Semester cannot exceed 8"],
    },
    courseType: {
      type: String,
      enum: ["Core", "Elective", "Lab", "Project"],
      default: "Core",
    },
    seatsAvailable: {
      type: Number,
      min: [0, "Seats available cannot be negative"],
      default: 60,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

courseSchema.index({ department: 1 });

module.exports = mongoose.model("Course", courseSchema);
