const { Router } = require("express");
const { create, getAll, book, getBookings } = require("../controllers/advisory.controller");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { createServiceSchema, bookServiceSchema } = require("../validators/advisory.validator");
const { UserRoles } = require("../constants");

const router = Router();

// Public: View Advisors
router.get("/", getAll);

// Protected Routes
router.use(verifyJWT);

// Advisor: Create Service
router.post(
  "/services",
  authorizeRoles(UserRoles.ADVISOR),
  validate(createServiceSchema),
  create
);

// Business/Investor: Book Session
router.post(
  "/book",
  authorizeRoles(UserRoles.BUSINESS, UserRoles.INVESTOR),
  validate(bookServiceSchema),
  book
);

// Get My Bookings (Anyone)
router.get("/bookings", getBookings);

module.exports = router;