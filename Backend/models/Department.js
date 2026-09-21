const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Department name cannot exceed 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      trim: true,
      unique: true,
      uppercase: true,
      maxlength: [10, "Department code cannot exceed 10 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    headOfDepartment: {
      type: String,
      trim: true,
    },
    establishedYear: {
      type: Number,
      min: [1900, "Established year seems invalid"],
      max: [new Date().getFullYear(), "Established year cannot be in the future"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

departmentSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "department",
});

departmentSchema.set("toJSON", { virtuals: true });
departmentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Department", departmentSchema);
