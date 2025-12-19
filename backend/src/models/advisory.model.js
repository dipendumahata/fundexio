const mongoose = require("mongoose");

// 1. Service Schema (Advisor Offer)
const advisoryServiceSchema = new mongoose.Schema({
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true, // e.g., "Startup Financial Planning"
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true, // e.g., 150 (per hour)
  },
  duration: {
    type: Number, // in minutes, e.g., 60
    default: 60,
  },
  tags: [{ type: String }], // e.g., ["Finance", "Strategy"]
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 2. Booking Schema (Request)
const advisoryBookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdvisoryService",
    required: true,
  },
  client: { // Who is booking (Business)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  advisor: { // Direct reference for easier querying
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scheduledAt: { // Date & Time
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
    default: "PENDING",
  },
  notes: { type: String },
  meetingLink: { type: String } // Zoom/Google Meet link
}, { timestamps: true });

const AdvisoryService = mongoose.model("AdvisoryService", advisoryServiceSchema);
const AdvisoryBooking = mongoose.model("AdvisoryBooking", advisoryBookingSchema);

module.exports = { AdvisoryService, AdvisoryBooking };