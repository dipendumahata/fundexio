const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { Notification } = require("../models/notification.model");

// নোটিফিকেশন ফেচ করা
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched"));
});

// সব রিড হিসেবে মার্ক করা
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "All notifications marked as read"));
});

module.exports = { getNotifications, markAllAsRead };