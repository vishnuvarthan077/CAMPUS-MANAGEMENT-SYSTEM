const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      unique: true,
      maxlength: [120, "Company name cannot exceed 120 characters"],
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [80, "Industry cannot exceed 80 characters"],
    },
    website: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

companySchema.virtual("drives", {
  ref: "Drive",
  localField: "_id",
  foreignField: "company",
});

companySchema.set("toJSON", { virtuals: true });
companySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Company", companySchema);
