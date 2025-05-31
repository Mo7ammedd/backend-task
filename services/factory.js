const { createNotFoundError } = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

exports.getAll = function (Model, populateOptions) {
  return asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Apply user filtering for user-specific data
    const queryFilter = req.user ? { user: req.user._id } : {};

    let query = Model.find(queryFilter);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const total = await Model.countDocuments(queryFilter);
    const docs = await query.skip(skip).limit(limit);

    res.status(200).json({
      status: "success",
      results: docs.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        limit,
      },
      data: docs,
    });
  });
};

exports.getOne = function (Model, populateOptions) {
  return asyncHandler(async (req, res, next) => {
    const queryFilter = { _id: req.params.id };
    if (req.user) {
      queryFilter.user = req.user._id;
    }

    let query = Model.findOne(queryFilter);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;
    if (!doc) {
      return next(createNotFoundError("Document"));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.createOne = function (Model) {
  return asyncHandler(async (req, res, next) => {
    let docData = { ...req.body };
    if (req.user) {
      docData.user = req.user._id;
    }

    const doc = await Model.create(docData);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });
};

exports.updateOne = function (Model) {
  return asyncHandler(async (req, res, next) => {
    const queryFilter = { _id: req.params.id };
    if (req.user) {
      queryFilter.user = req.user._id;
    }

    const doc = await Model.findOneAndUpdate(queryFilter, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(createNotFoundError("Document"));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.deleteOne = function (Model) {
  return asyncHandler(async (req, res, next) => {
    const queryFilter = { _id: req.params.id };
    if (req.user) {
      queryFilter.user = req.user._id;
    }

    const doc = await Model.findOneAndDelete(queryFilter);

    if (!doc) {
      return next(createNotFoundError("Document"));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};
