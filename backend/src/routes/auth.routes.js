const { Router } = require("express");
const { register, login, getCurrentUser, updateAccountDetails, changeCurrentPassword } = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

module.exports = router;
