const { validationResult } = require("express-validator");
const todoService = require("../services/todoService");

// Helper to send consistent error responses
const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

// GET /api/todos
const getAllTodos = async (req, res) => {
  try {
    const { search, status, priority, page, limit } = req.query;
    const result = await todoService.getAllTodos({ search, status, priority, page, limit });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/todos/:id
const getTodoById = async (req, res) => {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    res.status(200).json({ success: true, todo });
  } catch (error) {
    sendError(res, error);
  }
};

// POST /api/todos
const createTodo = async (req, res) => {
  // Check for validation errors from express-validator middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json({ success: true, todo });
  } catch (error) {
    sendError(res, error);
  }
};

// PUT /api/todos/:id
const updateTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    res.status(200).json({ success: true, todo });
  } catch (error) {
    sendError(res, error);
  }
};

// PATCH /api/todos/:id/status
const updateTodoStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const todo = await todoService.updateTodoStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, todo });
  } catch (error) {
    sendError(res, error);
  }
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    await todoService.deleteTodo(req.params.id);
    res.status(200).json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/todos/stats
const getTodoStats = async (req, res) => {
  try {
    const stats = await todoService.getTodoStats();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    sendError(res, error);
  }
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
