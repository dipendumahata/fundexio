const { Router } = require("express");
const { createLoan, getLoans, applyLoan, getApplications, updateStatus } = require("../controllers/loan.controller");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { createLoanSchema, applyLoanSchema } = require("../validators/loan.validator");
const { UserRoles } = require("../constants");

const router = Router();

// Public: Get all loans
router.get("/", getLoans);

// Protected Routes
router.use(verifyJWT);

// Banker: Create Loan Product
router.post(
  "/",
  authorizeRoles(UserRoles.BANKER),
  validate(createLoanSchema),
  createLoan
);

// Banker: View Applications
router.get(
  "/applications",
  authorizeRoles(UserRoles.BANKER),
  getApplications
);

// Business: Apply for Loan
router.post(
  "/apply",
  authorizeRoles(UserRoles.BUSINESS),
  validate(applyLoanSchema),
  applyLoan
);

router.patch(
  "/applications/:applicationId/status",
  verifyJWT,
  authorizeRoles(UserRoles.BANKER),
  updateStatus
);

module.exports = router;