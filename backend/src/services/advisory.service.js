const { AdvisoryService, AdvisoryBooking } = require("../models/advisory.model");
const { Notification } = require("../models/notification.model"); // ✅ NEW: Notification model
const { ApiError } = require("../utils/ApiError");

// 🧑‍🏫 Advisor: Create new service
const createService = async (advisorId, data) => {
  return await AdvisoryService.create({ ...data, advisor: advisorId });
};

// 🌍 Public: Get all advisory services
const getAllServices = async (filter = {}) => {
  // Simple search logic
  const query = { isActive: true };
  if (filter.tag) query.tags = filter.tag;

  return await AdvisoryService.find(query)
    .populate("advisor", "firstName lastName avatar bio hourlyRate")
    .sort({ createdAt: -1 });
};

// 🛠️ Modified: Book a session + notify advisor
const bookSession = async (clientId, data) => {
  const { serviceId, scheduledAt, notes } = data;

  const service = await AdvisoryService.findById(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  // (Optional future) check availability / conflicts

  const booking = await AdvisoryBooking.create({
    service: serviceId,
    client: clientId,
    advisor: service.advisor,
    scheduledAt,
    notes,
    status: "PENDING",
  });

  // ✅ NEW: Send Notification to Advisor
  await Notification.create({
    recipient: service.advisor,
    title: "New Session Request 📅",
    message: `New booking request for '${service.title}' on ${new Date(
      scheduledAt
    ).toDateString()}. Check dashboard to confirm.`,
    type: "SYSTEM",
    link: "/dashboard",
  });

  return booking;
};

// 📅 Get My Bookings (For Client or Advisor)
const getMyBookings = async (userId, role) => {
  const query = role === "ADVISOR" ? { advisor: userId } : { client: userId };

  return await AdvisoryBooking.find(query)
    .populate("service", "title price")
    .populate(
      role === "ADVISOR" ? "client" : "advisor",
      "firstName lastName email"
    )
    .sort({ scheduledAt: 1 });
};

module.exports = {
  createService,
  getAllServices,
  bookSession,
  getMyBookings,
};
