const { validationResult } = require("express-validator");
const { createValidationError } = require("./apiError");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    const errorMessage = `Validation failed: ${errorMessages
      .map((e) => e.message)
      .join(", ")}`;
    return next(createValidationError(errorMessage));
  }
  next();
};

module.exports = {
  handleValidationErrors,
};
