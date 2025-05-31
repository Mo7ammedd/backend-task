const { body, query } = require("express-validator");

const registerValidation = [
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("displayName")
    .notEmpty()
    .withMessage("Display name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Display name must be between 2 and 50 characters"),

  body("experienceYears")
    .isNumeric()
    .withMessage("Experience years must be a number")
    .isInt({ min: 0, max: 50 })
    .withMessage("Experience years must be between 0 and 50"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),

  body("level")
    .isIn(["fresh", "junior", "midLevel", "senior"])
    .withMessage("Level must be one of: fresh, junior, midLevel, senior"),
];

const loginValidation = [
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("password").notEmpty().withMessage("Password is required"),
];

const refreshTokenValidation = [
  query("token").notEmpty().withMessage("Refresh token is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
};
