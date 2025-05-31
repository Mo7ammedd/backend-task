const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { handleValidationErrors } = require("../utils/validationHandler");
const {
  createTodoValidation,
  updateTodoValidation,
  todoIdValidation,
  paginationValidation,
} = require("../utils/validators/todoValidator");
const todoService = require("../services/todoService");

router.get(
  "/",
  protect,
  paginationValidation,
  handleValidationErrors,
  todoService.getAllTodos
);

router.get(
  "/:id",
  protect,
  todoIdValidation,
  handleValidationErrors,
  todoService.getTodoById
);
router.post(
  "/",
  protect,
  createTodoValidation,
  handleValidationErrors,
  todoService.createTodo
);
router.put(
  "/:id",
  protect,
  updateTodoValidation,
  handleValidationErrors,
  todoService.updateTodo
);
router.delete(
  "/:id",
  protect,
  todoIdValidation,
  handleValidationErrors,
  todoService.deleteTodo
);

module.exports = router;
