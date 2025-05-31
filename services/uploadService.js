const path = require("path");
const asyncHandler = require("express-async-handler");
const { createValidationError } = require("../utils/apiError");

exports.getFileUrl = (filename) => {
  return `/uploads/images/${path.basename(filename)}`;
};

exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(createValidationError("No image uploaded"));
  }

  const fileUrl = exports.getFileUrl(req.file.path);

  res.status(200).json({
    status: "success",
    data: {
      imageUrl: fileUrl,
      filename: req.file.filename,
    },
  });
});
