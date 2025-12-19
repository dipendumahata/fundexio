const { LoanProduct, LoanApplication } = require("../models/loan.model");
const { Notification } = require("../models/notification.model")
const { ApiError } = require("../utils/ApiError");

// 🏦 Banker: Create Product
const createProduct = async (userId, data) => {
  return await LoanProduct.create({ ...data, banker: userId });
};

// 🌍 Public: Get All Products
const getAllProducts = async () => {
  return await LoanProduct.find({ isActive: true }).sort({ createdAt: -1 });
};

// 🏢 Business: Apply for Loan
const applyForLoan = async (userId, data) => {
  const { loanProductId, amountRequested, notes } = data;
  
  const product = await LoanProduct.findById(loanProductId);
  if (!product) throw new ApiError(404, "Loan product not found");

  // Check limits... (existing logic)

  const application = await LoanApplication.create({
    loanProduct: loanProductId,
    applicant: userId,
    amountRequested,
    notes,
    status: "PENDING"
  });

  // ✅ NEW: Send Notification to Banker
  await Notification.create({
    recipient: product.banker,
    title: "New Loan Application 🏦",
    message: `A business has applied for '${product.title}'. Amount: $${amountRequested.toLocaleString()}`,
    type: "LOAN",
    link: "/dashboard" // Clicking takes them to dashboard to approve
  });

  return application;
};

// 🏦 Banker: View Applications
const getBankerApplications = async (bankerId) => {
  // Find all products by this banker
  const products = await LoanProduct.find({ banker: bankerId }).select("_id");
  const productIds = products.map(p => p._id);

  // Find applications for these products
  return await LoanApplication.find({ loanProduct: { $in: productIds } })
    .populate("applicant", "firstName lastName email")
    .populate("loanProduct", "title");
};

const updateApplicationStatus = async (bankerId, applicationId, status) => {
  // 1. Find Application
  const application = await LoanApplication.findById(applicationId).populate("loanProduct");
  if (!application) throw new ApiError(404, "Application not found");

  // 2. Security Check: এই লোনটি কি এই ব্যাংকারের?
  if (application.loanProduct.banker.toString() !== bankerId.toString()) {
    throw new ApiError(403, "You are not authorized to manage this application");
  }

  // 3. Update Status
  application.status = status;
  await application.save();

  // 4. Notify the Business User (Applicant)
  await Notification.create({
    recipient: application.applicant,
    title: `Loan Application ${status === 'APPROVED' ? 'Approved ✅' : 'Rejected ❌'}`,
    message: `Your application for ${application.loanProduct.title} has been ${status.toLowerCase()}.`,
    type: "LOAN",
    link: "/marketplace"
  });

  return application;
};

module.exports = { 
    createProduct, getAllProducts, applyForLoan, getBankerApplications, 
    updateApplicationStatus // 👈 Export new function
};