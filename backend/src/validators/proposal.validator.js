const { z } = require("zod");
const { AvailableProposalStatus } = require("../constants");

const createProposalSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be detailed (min 20 chars)"),
    shortDescription: z.string().max(150, "Short description must be under 150 chars"),
    amountAsked: z.number().min(1, "Amount must be greater than 0"),
    equityOffered: z.number().min(0).max(100, "Equity must be between 0-100%"),
    industry: z.string({ required_error: "Industry is required" }),
    fundingStage: z.string({ required_error: "Funding stage is required" }),
    // Images will be handled as an array of strings (URLs) for now
    images: z.array(z.string().url()).optional(),
  }),
});

module.exports = { createProposalSchema };