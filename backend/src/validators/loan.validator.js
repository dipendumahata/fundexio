const { z } = require("zod");

const createLoanSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    bankName: z.string().min(2),
    minAmount: z.number().min(1000),
    maxAmount: z.number().min(1000),
    interestRate: z.string(),
    tenure: z.string(),
    processingTime: z.string(),
    type: z.enum(["TERM_LOAN", "LINE_OF_CREDIT", "EQUIPMENT_FINANCING"]),
    description: z.string().optional(),
  }),
});

const applyLoanSchema = z.object({
  body: z.object({
    loanProductId: z.string(),
    amountRequested: z.number().min(1000),
    notes: z.string().optional(),
  }),
});

module.exports = { createLoanSchema, applyLoanSchema };