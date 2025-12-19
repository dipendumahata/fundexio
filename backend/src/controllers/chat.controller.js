const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const chatService = require("../services/chat.service");

const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  const message = await chatService.sendMessage(
    req.user._id, // Sender (Logged in user)
    receiverId,
    content
  );

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message sent successfully"));
});

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await chatService.getUserConversations(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, conversations, "Conversations fetched"));
});

const getChatHistory = asyncHandler(async (req, res) => {
  const messages = await chatService.getMessages(req.params.conversationId);

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Chat history fetched"));
});

module.exports = {
  sendMessage,
  getConversations,
  getChatHistory,
};