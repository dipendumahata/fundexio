const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const proposalService = require("../services/proposal.service");

const create = asyncHandler(async (req, res) => {
  // Service call: Pass body data AND the logged-in user's ID
  const proposal = await proposalService.createProposal(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, proposal, "Proposal created successfully"));
});

const getAll = asyncHandler(async (req, res) => {
  const proposals = await proposalService.getAllProposals(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, proposals, "Proposals fetched successfully"));
});

const getOne = asyncHandler(async (req, res) => {
  const proposal = await proposalService.getProposalById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, proposal, "Proposal details fetched"));
});

module.exports = {
  create,
  getAll,
  getOne,
};