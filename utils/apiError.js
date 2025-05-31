class ApiError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

const createError = (message, statusCode) => {
  return new ApiError(message, statusCode);
};

const createValidationError = (message) => {
  return new ApiError(message, 400);
};

const createNotFoundError = (resource) => {
  return new ApiError(`${resource} not found`, 404);
};

const createUnauthorizedError = (message = "Unauthorized access") => {
  return new ApiError(message, 401);
};

const createForbiddenError = (message = "Forbidden access") => {
  return new ApiError(message, 403);
};

const createConflictError = (message) => {
  return new ApiError(message, 409);
};

module.exports = {
  ApiError,
  createError,
  createValidationError,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  createConflictError,
};
