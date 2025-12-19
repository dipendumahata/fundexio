const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const authService = require("../services/auth.service");
const { User } = require("../models/user.model");

// Cookie Options (Rule 5 Security)
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } =
    await authService.loginUser(email, password);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    location,
    bio,
    investmentFocus,
    riskTolerance,
    hourlyRate,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        firstName,
        lastName,
        phone,
        location,
        bio,
        investmentFocus,
        riskTolerance,
        hourlyRate,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "Account details updated successfully"
      )
    );
});

/**
 * 🔐 Change Current Password
 */
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  // pre-save hook will hash password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password changed successfully")
    );
});

module.exports = {
  register,
  login,
  getCurrentUser,
  updateAccountDetails,
  changeCurrentPassword, // ✅ added
};
