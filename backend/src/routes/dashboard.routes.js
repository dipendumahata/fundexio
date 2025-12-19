const { Router } = require("express");
const { getStats } = require("../controllers/dashboard.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/stats", verifyJWT, getStats);

module.exports = router;