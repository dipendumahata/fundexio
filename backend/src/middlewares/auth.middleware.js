const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

// 🔒 1. Verify JWT (Check if user is logged in)
const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Token khojo: Cookies othoba Header theke
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token found");
    }

    // Token verify koro
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // User khojo DB te
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Request object e User set kore dao
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

// 👮 2. Role Based Access Control (RBAC)
// Example usage: authorizeRoles("ADMIN", "BUSINESS")
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "User authentication required");
    }
    
    // Jodi User er Role allowed list e na thake
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403, 
        `Role: ${req.user.role} is not allowed to access this resource`
      );
    }
    
    next();
  };
};

module.exports = { verifyJWT, authorizeRoles };