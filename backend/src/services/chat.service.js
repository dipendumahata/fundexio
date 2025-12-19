const { Conversation } = require("../models/conversation.model");
const { Message } = require("../models/message.model");
const { ApiError } = require("../utils/ApiError");

/**
 * Send a message (Start conversation if not exists)
 */
const sendMessage = async (senderId, receiverId, content) => {
  // ১. চেক করি আগে এদের কথা হয়েছে কি না
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  // ২. না হলে নতুন কনভারসেশন বানাই
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      lastMessage: content,
      lastMessageAt: new Date(),
    });
  } else {
    // ৩. হলে লাস্ট মেসেজ আপডেট করি
    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    await conversation.save();
  }

  // ৪. মেসেজ সেভ করি
  const message = await Message.create({
    conversationId: conversation._id,
    sender: senderId,
    content,
  });

  return message;
};

/**
 * Get all conversations for a user (Sidebar List)
 */
const getUserConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "firstName lastName email role") // নাম ও ছবি দেখানোর জন্য
    .sort({ lastMessageAt: -1 }); // লেটেস্ট চ্যাট উপরে থাকবে

  return conversations;
};

/**
 * Get messages of a specific conversation
 */
const getMessages = async (conversationId) => {
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 }); // পুরানো মেসেজ আগে, নতুন পরে
  
  return messages;
};

module.exports = {
  sendMessage,
  getUserConversations,
  getMessages,
};