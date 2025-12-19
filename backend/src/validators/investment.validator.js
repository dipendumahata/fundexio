const { z } = require("zod");

const investSchema = z.object({
  body: z.object({
    proposalId: z.string({ required_error: "Proposal ID is required" }),
    amount: z.number().min(100, "Minimum investment amount is $100"),
    remarks: z.string().optional(),
  }),
});

module.exports = { investSchema };