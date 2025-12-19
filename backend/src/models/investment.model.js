const mongoose = require("mongoose");
const { InvestmentStatus, AvailableInvestmentStatus } = require("../constants");

const investmentSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // যে ইনভেস্ট করছে
      required: true,
      index: true,
    },
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal", // যে প্রজেক্টে ইনভেস্ট হচ্ছে
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: AvailableInvestmentStatus,
      default: InvestmentStatus.PENDING,
    },
    transactionId: { // পেমেন্ট গেটওয়ের আইডি (ফিউচারের জন্য)
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
    }
  },
  { timestamps: true }
);

// Rule 7: Compound Index
// একজন ইনভেস্টর একটি প্রপোজাল-এ কতবার ইনভেস্ট করেছে তা দ্রুত বের করতে
investmentSchema.index({ investor: 1, proposal: 1 });

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = { Investment };