const mongoose = require("mongoose");
const { ProposalStatus, AvailableProposalStatus } = require("../constants");

const proposalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Rule 7: Searching-এর জন্য ইনডেক্স
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: { // কার্ডে দেখানোর জন্য ছোট বর্ণনা
      type: String,
      required: true,
      maxLength: 150,
    },
    amountAsked: {
      type: Number,
      required: true,
      min: 0,
    },
    equityOffered: { // কত শতাংশ শেয়ার অফার করছে
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    industry: {
      type: String,
      required: true, // e.g., "Technology", "Healthcare"
      index: true,    // Rule 7: ফিল্টারিং-এর জন্য
    },
    fundingStage: {
      type: String,
      required: true, // e.g., "Seed", "Series A"
    },
    status: {
      type: String,
      enum: AvailableProposalStatus,
      default: ProposalStatus.ACTIVE,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Business User-এর সাথে লিঙ্ক
      required: true,
    },
    totalFunded: { // কত টাকা অলরেডি উঠেছে
      type: Number,
      default: 0,
    },
    investorCount: { // কতজন ইনভেস্টর ইনভেস্ট করেছে
      type: Number,
      default: 0,
    },
    images: [ // ইমেজের URL রাখার জন্য
      {
        type: String,
      }
    ]
  },
  { timestamps: true }
);

// Rule 7: Indexing for faster Dashboard queries
// একটি ইউজারের সব প্রপোজাল দ্রুত খোঁজার জন্য
proposalSchema.index({ createdBy: 1, status: 1 });

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = { Proposal };