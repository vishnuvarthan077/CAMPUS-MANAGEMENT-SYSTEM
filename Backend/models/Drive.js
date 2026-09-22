const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Drive must belong to a company"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    driveType: {
      type: String,
      enum: ["On-Campus", "Off-Campus", "Pool Campus"],
      default: "On-Campus",
    },
    ctc: {
      type: Number,
      required: [true, "CTC (in LPA) is required"],
      min: [0, "CTC cannot be negative"],
    },
    minCgpa: {
      type: Number,
      min: [0, "Minimum CGPA cannot be negative"],
      max: [10, "Minimum CGPA cannot exceed 10"],
      default: 0,
    },
    maxBacklogs: {
      type: Number,
      min: [0, "Max backlogs cannot be negative"],
      default: 0,
    },
    allowedDepartments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    driveDate: {
      type: Date,
      required: [true, "Drive date is required"],
    },
    applicationDeadline: {
      type: Date,
    },
    rounds: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
  },
  { timestamps: true }
);

driveSchema.index({ status: 1, driveDate: 1 });

driveSchema.virtual("placements", {
  ref: "Placement",
  localField: "_id",
  foreignField: "drive",
});

driveSchema.set("toJSON", { virtuals: true });
driveSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Drive", driveSchema);
