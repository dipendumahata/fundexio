const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AvailableUserRoles, UserRoles } = require("../constants");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRoles.BUSINESS, // Default role
      required: true,
    },
    refreshToken: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String, // e.g., "San Francisco, CA"
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    avatar: {
      type: String, // প্রোফাইল পিকচার URL
    },
    // For Investors
    investmentFocus: {
      type: String, // e.g., "Technology", "Healthcare"
    },
    riskTolerance: {
      type: String, // e.g., "Conservative", "Aggressive"
    },
    investmentRange: {
      type: String, // e.g., "$10K - $50K"
    },
    // For Advisors
    hourlyRate: {
      type: Number, // e.g., 150
    },
    experienceYears: {
      type: Number,
    }
  },
  { timestamps: true }
);

// 🔒 Password Hashing Middleware (FIXED)
userSchema.pre("save", async function () {
  // jodi password field change na hoy, tahole kichu korar dorkar nei
  if (!this.isModified("password")) return;

  // password hash kore set kore dichhi
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 Custom Methods

// 1. Password Check
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 2. Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// 3. Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = { User };