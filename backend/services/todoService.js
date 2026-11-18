const Todo = require("../models/Todo");

// Get all todos with optional filtering, search, and pagination
const getAllTodos = async ({ search, status, priority, page = 1, limit = 10 }) => {
  const query = {};

  // Search by title or description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by priority
  if (priority) {
    query.priority = priority;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Todo.countDocuments(query);
  const todos = await Todo.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    todos,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// Get a single todo by ID
const getTodoById = async (id) => {
  const todo = await Todo.findById(id);
  if (!todo) {
    const error = new Error("Todo not found");
    error.statusCode = 404;
    throw error;
  }
  return todo;
};

// Create a new todo
const createTodo = async (data) => {
  const todo = new Todo(data);
  await todo.save();
  return todo;
};

// Update an existing todo
const updateTodo = async (id, data) => {
  const todo = await Todo.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!todo) {
    const error = new Error("Todo not found");
    error.statusCode = 404;
    throw error;
  }
  return todo;
};

// Update only the status of a todo
const updateTodoStatus = async (id, status) => {
  const todo = await Todo.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true }
  );
  if (!todo) {
    const error = new Error("Todo not found");
    error.statusCode = 404;
    throw error;
  }
  return todo;
};

// Delete a todo
const deleteTodo = async (id) => {
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) {
    const error = new Error("Todo not found");
    error.statusCode = 404;
    throw error;
  }
  return todo;
};

// Get summary stats
const getTodoStats = async () => {
  const stats = await Todo.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { pending: 0, "in-progress": 0, completed: 0, total: 0 };
  stats.forEach(({ _id, count }) => {
    result[_id] = count;
    result.total += count;
  });

  return result;
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
  getTodoStats,
};
