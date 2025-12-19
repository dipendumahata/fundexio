const { Proposal } = require("../models/proposal.model");
const { ApiError } = require("../utils/ApiError");

const createProposal = async (proposalData, userId) => {
  const proposal = await Proposal.create({
    ...proposalData,
    createdBy: userId, // Link to the Business User
  });
  
  return proposal;
};


const getAllProposals = async (query) => {
  // Simple filtering logic (Extendable later)
  const filter = {};
  if (query.industry) filter.industry = query.industry;
  if (query.fundingStage) filter.fundingStage = query.fundingStage;
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } }, // Case-insensitive search
      { description: { $regex: query.search, $options: "i" } }
    ];
  }
  
  // Default: Only show ACTIVE proposals
  filter.status = "ACTIVE";

  const proposals = await Proposal.find(filter)
    .populate("createdBy", "firstName lastName email") // Show Business Info
    .sort({ createdAt: -1 }); // Newest first

  return proposals;
};

const getProposalById = async (id) => {
  const proposal = await Proposal.findById(id)
    .populate("createdBy", "firstName lastName email");

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  return proposal;
};

module.exports = {
  createProposal,
  getAllProposals,
  getProposalById,
};