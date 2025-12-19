const { z } = require("zod");
const { AvailableUserRoles } = require("../constants");

const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(2, "First name must be at least 2 chars long"),
    lastName: z
      .string({ required_error: "Last name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    role: z.enum(AvailableUserRoles, {
      errorMap: () => ({ message: "Invalid User Role" }),
    }),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

module.exports = { registerSchema, loginSchema };