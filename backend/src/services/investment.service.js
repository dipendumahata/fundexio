const mongoose = require("mongoose");
const { Investment } = require("../models/investment.model");
const { Proposal } = require("../models/proposal.model");
const { ApiError } = require("../utils/ApiError");
const { InvestmentStatus } = require("../constants");
const { Notification } = require("../models/notification.model");

/**
 * Create a new investment (With Transaction)
 */
const createInvestment = async (investorId, data) => {
  const { proposalId, amount, remarks } = data;

  // 1. Start Database Session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Check if Proposal exists
    const proposal = await Proposal.findById(proposalId).session(session);
    if (!proposal) {
      throw new ApiError(404, "Proposal not found");
    }

    if (proposal.status !== "ACTIVE") {
      throw new ApiError(400, "This proposal is no longer accepting investments");
    }

    // 3. Create Investment Record
    const investment = await Investment.create(
      [
        {
          investor: investorId,
          proposal: proposalId,
          amount,
          status: InvestmentStatus.COMPLETED, // For MVP, assuming instant success
          remarks,
        },
      ],
      { session }
    );

    // 4. Update Proposal Stats (Add amount & increment investor count)
    proposal.totalFunded += amount;
    proposal.investorCount += 1;
    
    // Check if fully funded (Optional Logic)
    if (proposal.totalFunded >= proposal.amountAsked) {
        proposal.status = "FUNDED";
    }

    await proposal.save({ session });

    // 👇 NEW: Send Notification to Business Owner
    await Notification.create([{
        recipient: proposal.createdBy, // Business Owner ID
        title: "New Investment Received!",
        message: `You received $${amount} from an investor for ${proposal.title}.`,
        type: "INVESTMENT",
        link: `/marketplace/proposals`
    }], { session });
    // 5. Commit Transaction (Save everything)
    await session.commitTransaction();
    return investment[0];

  } catch (error) {
    // If anything fails, undo everything
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get Investor's Portfolio
 */
const getInvestorPortfolio = async (investorId) => {
  const investments = await Investment.find({ investor: investorId })
    .populate("proposal", "title industry status") // Show project details
    .sort({ createdAt: -1 });
  
  return investments;
};

module.exports = {
  createInvestment,
  getInvestorPortfolio,
};