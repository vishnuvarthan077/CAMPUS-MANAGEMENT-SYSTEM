const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Notice content is required"],
      trim: true,
      maxlength: [2000, "Content cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      enum: ["General", "Academic", "Exam", "Event", "Holiday", "Urgent"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Normal", "High"],
      default: "Normal",
    },
    targetAudience: {
      type: String,
      enum: ["All", "Students", "Faculty", "Staff"],
      default: "All",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    postedBy: {
      type: String,
      required: [true, "Posted by is required"],
      trim: true,
      maxlength: [100, "Posted by cannot exceed 100 characters"],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

noticeSchema.index({ isPinned: -1, createdAt: -1 });
noticeSchema.index({ title: "text", content: "text" });

noticeSchema.virtual("isExpired").get(function () {
  return Boolean(this.expiryDate && this.expiryDate.getTime() < Date.now());
});

noticeSchema.set("toJSON", { virtuals: true });
noticeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Notice", noticeSchema);
