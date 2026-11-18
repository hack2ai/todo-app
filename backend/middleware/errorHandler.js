// Handle Mongoose CastError (invalid ObjectId)
const handleCastError = (err) => {
  return { statusCode: 400, message: `Invalid ID: ${err.value}` };
};

// Handle Mongoose duplicate key error
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return { statusCode: 400, message: `Duplicate value for field: ${field}` };
};

// Handle Mongoose validation error
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return { statusCode: 400, message: messages.join(". ") };
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Specific Mongoose error handling
  if (err.name === "CastError") {
    ({ statusCode, message } = handleCastError(err));
  } else if (err.code === 11000) {
    ({ statusCode, message } = handleDuplicateKeyError(err));
  } else if (err.name === "ValidationError") {
    ({ statusCode, message } = handleValidationError(err));
  }

  // Log errors in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
