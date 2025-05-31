const { body, param, query } = require("express-validator");

const createTodoValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("desc")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

    body("image")
    .notEmpty()
    .withMessage("Image is required")
    .custom((value) => {
      return value.startsWith('http') || value.startsWith('/uploads/') 
        ? true 
        : false;
    })
    .withMessage("Image must be a valid URL or an uploaded image path"),

  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .custom((value) => {
      const dueDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        throw new Error("Due date cannot be in the past");
      }
      return true;
    }),
];

const updateTodoValidation = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("desc")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("image").optional().isURL().withMessage("Image must be a valid URL"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  body("status")
    .optional()
    .isIn(["waiting", "in-progress", "completed"])
    .withMessage("Status must be one of: waiting, in-progress, completed"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .custom((value) => {
      if (value) {
        const dueDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dueDate < today) {
          throw new Error("Due date cannot be in the past");
        }
      }
      return true;
    }),
];

const todoIdValidation = [
  param("id").isMongoId().withMessage("Invalid todo ID"),
];

const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

module.exports = {
  createTodoValidation,
  updateTodoValidation,
  todoIdValidation,
  paginationValidation,
};
