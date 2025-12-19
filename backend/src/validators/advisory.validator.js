const { z } = require("zod");

const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().optional(),
    price: z.number().min(0),
    duration: z.number().min(15).default(60),
    tags: z.array(z.string()).optional(),
  }),
});

const bookServiceSchema = z.object({
  body: z.object({
    serviceId: z.string(),
    scheduledAt: z.string().datetime(), // Must be ISO date string
    notes: z.string().optional(),
  }),
});

module.exports = { createServiceSchema, bookServiceSchema };