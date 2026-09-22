const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
      unique: true,
      uppercase: true,
      maxlength: [30, "Roll number cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    degree: {
      type: String,
      trim: true,
      maxlength: [50, "Degree cannot exceed 50 characters"],
    },
    graduationYear: {
      type: Number,
      required: [true, "Graduation year is required"],
      min: [1980, "Graduation year seems invalid"],
      max: [new Date().getFullYear() + 5, "Graduation year seems too far in the future"],
    },
    currentCompany: {
      type: String,
      trim: true,
      maxlength: [100, "Current company cannot exceed 100 characters"],
    },
    designation: {
      type: String,
      trim: true,
      maxlength: [100, "Designation cannot exceed 100 characters"],
    },
    currentLocation: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

alumniSchema.index({ fullName: "text", currentCompany: "text", skills: "text" });

module.exports = mongoose.model("Alumni", alumniSchema);
