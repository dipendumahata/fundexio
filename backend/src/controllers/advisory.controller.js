const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const advisoryService = require("../services/advisory.service");

const create = asyncHandler(async (req, res) => {
  const service = await advisoryService.createService(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, service, "Service created"));
});

const getAll = asyncHandler(async (req, res) => {
  const services = await advisoryService.getAllServices(req.query);
  return res.status(200).json(new ApiResponse(200, services, "Services fetched"));
});

const book = asyncHandler(async (req, res) => {
  const booking = await advisoryService.bookSession(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, booking, "Session booked successfully"));
});

const getBookings = asyncHandler(async (req, res) => {
  const bookings = await advisoryService.getMyBookings(req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, bookings, "Bookings fetched"));
});

module.exports = { create, getAll, book, getBookings };