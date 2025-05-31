const Todo = require("../models/Todo");
const factory = require("./factory");
const asyncHandler = require("express-async-handler");
const { createNotFoundError } = require("../utils/apiError");

exports.getAllTodos = factory.getAll(Todo);
exports.getTodoById = factory.getOne(Todo);

exports.createTodo = asyncHandler(async (req, res, next) => {
  const { title, desc, image, priority, dueDate } = req.body;
  
  const todo = await Todo.create({
    title,
    desc,
    image,
    priority,
    dueDate,
    user: req.user._id,
    status: 'waiting', 
  });

  res.status(201).json({
    status: "success",
    data: todo,
  });
});

exports.updateTodo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const todo = await Todo.findOne({ _id: id, user: req.user._id });
  
  if (!todo) {
    return next(createNotFoundError("Todo"));
  }

  if (req.body.title) todo.title = req.body.title;
  if (req.body.desc) todo.desc = req.body.desc;
  if (req.body.image) todo.image = req.body.image;
  if (req.body.priority) todo.priority = req.body.priority;
  if (req.body.status) todo.status = req.body.status;
  if (req.body.dueDate) todo.dueDate = req.body.dueDate;

  await todo.save();

  res.status(200).json({
    status: "success",
    data: todo,
  });
});

exports.deleteTodo = factory.deleteOne(Todo);
