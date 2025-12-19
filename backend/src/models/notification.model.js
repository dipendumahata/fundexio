const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["INVESTMENT", "LOAN", "MESSAGE", "SYSTEM"],
      default: "SYSTEM",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // e.g., "/proposals/123" (ক্লিক করলে কোথায় যাবে)
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = { Notification };