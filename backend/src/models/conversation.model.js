const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: String, // সাইডবারে শেষ মেসেজটি দেখানোর জন্য
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// একজন ইউজারের সব কনভারসেশন দ্রুত খোঁজার জন্য ইনডেক্স
conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = { Conversation };