const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createUnauthorizedError } = require("../utils/apiError");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        createUnauthorizedError(
          "You are not logged in. Please log in to get access."
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        createUnauthorizedError(
          "The user belonging to this token no longer exists."
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(
        createUnauthorizedError("Invalid token. Please log in again.")
      );
    }
    if (error.name === "TokenExpiredError") {
      return next(
        createUnauthorizedError("Your token has expired. Please log in again.")
      );
    }
    next(error);
  }
};
