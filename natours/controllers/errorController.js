// controllers/errorController.js

const AppError = require('./../utils/appError');

// Handles errors for invalid database casting (e.g., invalid ObjectId)
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handles duplicate database field errors (e.g., trying to use an existing unique field value)
const handleDuplicateFieldsDB = err => {
  // Using regex to extract the value causing the duplication error
  const valueMatch = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const value = valueMatch ? valueMatch[0] : 'unknown'; // Default to 'unknown' if no match found
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handles validation errors from the database (e.g., required fields, type checks)
const handleValidationErrorDB = err => {
  // Creating a combined message from all validation errors
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//creates a new instance of the `AppError` class with a message indicating an invalid token.
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

// creates a new instance of the `AppError` class with a specific error message and status code.
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// Error response for development environment - includes more error details
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Error response for production environment - less detailed, more user-friendly
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Log the error for internal tracking
    console.error('ERROR 💥', err);
    // Send generic error message to client
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

// Main error handling middleware
module.exports = (err, req, res, next) => {
  // Default to 500 status code if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Differentiate between development and production error handling
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // Handle specific error types differently
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
