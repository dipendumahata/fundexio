const { Router } = require("express");
const { getNotifications, markAllAsRead } = require("../controllers/notification.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();
router.use(verifyJWT);

router.get("/", getNotifications);
router.patch("/mark-read", markAllAsRead);

module.exports = router;