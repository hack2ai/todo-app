const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const {
  validateObjectId,
  validateCreateTodo,
  validateUpdateTodo,
  validateStatusUpdate,
} = require("../middleware/validators");

// GET /api/todos/stats  — must be before /:id to avoid conflict
router.get("/stats", todoController.getTodoStats);

// GET    /api/todos         — get all todos (supports ?search=&status=&priority=&page=&limit=)
// POST   /api/todos         — create a new todo
router
  .route("/")
  .get(todoController.getAllTodos)
  .post(validateCreateTodo, todoController.createTodo);

// GET    /api/todos/:id     — get single todo
// PUT    /api/todos/:id     — update full todo
// DELETE /api/todos/:id     — delete todo
router
  .route("/:id")
  .get(validateObjectId, todoController.getTodoById)
  .put(validateObjectId, validateUpdateTodo, todoController.updateTodo)
  .delete(validateObjectId, todoController.deleteTodo);

// PATCH /api/todos/:id/status — update only status
router.patch(
  "/:id/status",
  validateObjectId,
  validateStatusUpdate,
  todoController.updateTodoStatus
);

module.exports = router;
