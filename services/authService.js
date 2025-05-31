const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { generateTokens, verifyToken } = require("../utils/tokenUtils");
const {
  createConflictError,
  createUnauthorizedError,
  createValidationError,
  createNotFoundError,
} = require("../utils/apiError");

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { phone, password, displayName, experienceYears, address, level } =
    req.body;
  const existingUser = await User.findOne({ phone });
  if (existingUser)
    return next(
      createConflictError("User already exists with this phone number")
    );
  const newUser = new User({
    phone,
    password,
    displayName,
    experienceYears,
    address,
    level,
  });
  await newUser.save();
  const { accessToken, refreshToken } = generateTokens(newUser._id);
  newUser.refreshTokens = [refreshToken];
  await newUser.save();
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: newUser._id,
        phone: newUser.phone,
        displayName: newUser.displayName,
        experienceYears: newUser.experienceYears,
        address: newUser.address,
        level: newUser.level,
      },
      accessToken,
      refreshToken,
    },
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user) return next(createUnauthorizedError("Invalid credentials"));
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid)
    return next(createUnauthorizedError("Invalid credentials"));
  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshTokens.push(refreshToken);
  await user.save();
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        phone: user.phone,
        displayName: user.displayName,
        experienceYears: user.experienceYears,
        address: user.address,
        level: user.level,
      },
      accessToken,
      refreshToken,
    },
  });
});

exports.logoutUser = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(createValidationError("Refresh token is required"));
  const user = await User.findOne({ refreshTokens: token });
  if (!user) return next(createUnauthorizedError("Invalid token"));
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  if (!token) return next(createValidationError("Refresh token is required"));
  try {
    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(token)) {
      return next(createUnauthorizedError("Invalid or expired refresh token"));
    }
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    user.refreshTokens.push(refreshToken);
    await user.save();
    res.status(200).json({
      status: "success",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(createUnauthorizedError("Invalid or expired refresh token"));
    }
    next(error);
  }
});

exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(createNotFoundError("User"));
  res.status(200).json({
    status: "success",
    data: {
      id: user._id,
      phone: user.phone,
      displayName: user.displayName,
      experienceYears: user.experienceYears,
      address: user.address,
      level: user.level,
    },
  });
});
