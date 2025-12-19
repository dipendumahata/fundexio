const { User } = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Object} { user, accessToken, refreshToken }
 */
const registerUser = async (userData) => {
  const { email, firstName, lastName, password, role } = userData;

  // 1. Check if user exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  // 2. Create User
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  // 3. Check creation
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return createdUser;
};

/**
 * Login user
 * @param {String} email 
 * @param {String} password 
 * @returns {Object} { user, accessToken, refreshToken }
 */
const loginUser = async (email, password) => {
  // 1. Find User
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 2. Check Password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // 3. Generate Tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // 4. Save Refresh Token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return { user: loggedInUser, accessToken, refreshToken };
};

module.exports = {
  registerUser,
  loginUser,
};