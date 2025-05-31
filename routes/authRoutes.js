const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { handleValidationErrors } = require("../utils/validationHandler");
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} = require("../utils/validators/authValidator");
const authService = require("../services/authService");

router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  authService.registerUser
);
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authService.loginUser
);
router.post("/logout", authService.logoutUser);
router.get(
  "/refresh-token",
  refreshTokenValidation,
  handleValidationErrors,
  authService.refreshToken
);
router.get("/profile", protect, authService.getUserProfile);

module.exports = router;
