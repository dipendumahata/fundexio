// middlewares/validate.middleware.js
const { ApiError } = require("../utils/ApiError");
const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
  try {
    // ❗ Just reading, not assigning into req.query/params
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();   // validation ok → move ahead
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(new ApiError(400, "Validation Failed", errors));
    }
    next(err);
  }
};

module.exports = { validate };
