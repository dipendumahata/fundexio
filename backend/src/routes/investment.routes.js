const { Router } = require("express");
const { invest, getMyPortfolio } = require("../controllers/investment.controller");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { investSchema } = require("../validators/investment.validator");
const { UserRoles } = require("../constants");

const router = Router();

// সব রাউট প্রোটেক্টেড
router.use(verifyJWT);

// Route: POST /api/v1/investments (Only Investors)
router.route("/").post(
  authorizeRoles(UserRoles.INVESTOR),
  validate(investSchema),
  invest
);

// Route: GET /api/v1/investments/my-portfolio
router.route("/my-portfolio").get(
  getMyPortfolio
);

module.exports = router;