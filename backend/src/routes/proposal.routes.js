const { Router } = require("express");
const { create, getAll, getOne } = require("../controllers/proposal.controller");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { createProposalSchema } = require("../validators/proposal.validator");
const { UserRoles } = require("../constants");

const router = Router();

// Public Routes (Everyone can see)
router.route("/").get(getAll);
router.route("/:id").get(getOne);

// Protected Routes (Only BUSINESS can create)
router.route("/").post(
  verifyJWT,
  authorizeRoles(UserRoles.BUSINESS), // Only BUSINESS accounts
  validate(createProposalSchema),     // Validate Input
  create
);

module.exports = router;