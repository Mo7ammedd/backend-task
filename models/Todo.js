const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'completed'],
      default: 'waiting',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

todoSchema.index({ user: 1 });

todoSchema.index({ status: 1 });

todoSchema.index({ dueDate: 1 });

todoSchema.index({ priority: 1 });

todoSchema.index({ user: 1, status: 1 });
todoSchema.index({ user: 1, dueDate: 1 });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;