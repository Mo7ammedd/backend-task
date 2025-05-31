const Todo = require("../models/Todo");
const factory = require("./factory");

exports.getAllTodos = factory.getAll(Todo);
exports.getTodoById = factory.getOne(Todo);
exports.createTodo = factory.createOne(Todo);
exports.updateTodo = factory.updateOne(Todo);
exports.deleteTodo = factory.deleteOne(Todo);
