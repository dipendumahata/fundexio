const { Router } = require("express");
const { sendMessage, getConversations, getChatHistory } = require("../controllers/chat.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.use(verifyJWT); // সব রাউটে লগইন মাস্ট

// 1. মেসেজ পাঠানো (POST /api/v1/chat/send)
router.post("/send", sendMessage);

// 2. সাইডবার চ্যাট লিস্ট (GET /api/v1/chat/conversations)
router.get("/conversations", getConversations);

// 3. নির্দিষ্ট চ্যাট ওপেন করা (GET /api/v1/chat/history/:conversationId)
router.get("/history/:conversationId", getChatHistory);

module.exports = router;