const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const loanService = require("../services/loan.service");

const createLoan = asyncHandler(async (req, res) => {
  const loan = await loanService.createProduct(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, loan, "Loan Product Created"));
});

const getLoans = asyncHandler(async (req, res) => {
  const loans = await loanService.getAllProducts();
  return res.status(200).json(new ApiResponse(200, loans, "Loans Fetched"));
});

const applyLoan = asyncHandler(async (req, res) => {
  const application = await loanService.applyForLoan(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, application, "Application Submitted"));
});

const getApplications = asyncHandler(async (req, res) => {
  const apps = await loanService.getBankerApplications(req.user._id);
  return res.status(200).json(new ApiResponse(200, apps, "Applications Fetched"));
});

const updateStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body; // Expecting "APPROVED" or "REJECTED"

  const updatedApp = await loanService.updateApplicationStatus(
    req.user._id,
    applicationId,
    status
  );

  return res.status(200).json(new ApiResponse(200, updatedApp, `Application ${status.toLowerCase()} successfully`));
});

module.exports = { createLoan, getLoans, applyLoan, getApplications, updateStatus };