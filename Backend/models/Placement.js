const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: [true, "Placement must reference a drive"],
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Student name cannot exceed 100 characters"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
      uppercase: true,
      maxlength: [30, "Roll number cannot exceed 30 characters"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    ctcOffered: {
      type: Number,
      required: [true, "Offered CTC (in LPA) is required"],
      min: [0, "CTC cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Offered", "Accepted", "Declined"],
      default: "Offered",
    },
    placementDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

placementSchema.index({ drive: 1 });
placementSchema.index({ department: 1 });
placementSchema.index({ rollNumber: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model("Placement", placementSchema);
