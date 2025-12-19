const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const investmentService = require("../services/investment.service");

const invest = asyncHandler(async (req, res) => {
  const investment = await investmentService.createInvestment(
    req.user._id, // Logged in user
    req.body
  );

  return res
    .status(201)
    .json(new ApiResponse(201, investment, "Investment successful"));
});

const getMyPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await investmentService.getInvestorPortfolio(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, portfolio, "Portfolio fetched successfully"));
});

module.exports = {
  invest,
  getMyPortfolio,
};