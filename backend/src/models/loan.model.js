const mongoose = require("mongoose");
const { UserRoles } = require("../constants");

// 1. Loan Product Schema (The Offer)
const loanProductSchema = new mongoose.Schema({
  banker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String, // e.g., "SME Business Loan"
    required: true,
  },
  bankName: {
    type: String, // e.g., "HDFC Bank"
    required: true,
  },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  interestRate: { type: String, required: true }, // e.g., "10-12%"
  tenure: { type: String, required: true },       // e.g., "1-5 Years"
  processingTime: { type: String, required: true }, // e.g., "7 Days"
  description: { type: String },
  type: {
    type: String,
    enum: ["TERM_LOAN", "LINE_OF_CREDIT", "EQUIPMENT_FINANCING"],
    default: "TERM_LOAN"
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 2. Loan Application Schema (The Request)
const loanApplicationSchema = new mongoose.Schema({
  loanProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LoanProduct",
    required: true,
  },
  applicant: { // The Business User
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amountRequested: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  notes: { type: String } // Why they need the loan
}, { timestamps: true });

const LoanProduct = mongoose.model("LoanProduct", loanProductSchema);
const LoanApplication = mongoose.model("LoanApplication", loanApplicationSchema);

module.exports = { LoanProduct, LoanApplication };