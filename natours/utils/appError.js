// utils/appError.js

/**
 * Custom Error class for handling operational errors.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    
    // Status type ('fail' for client errors, 'error' for server errors)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Indicates that this is an operational error

    /**
     * Capture the current call stack trace and attach it to the error object.
     * This helps in identifying where the error was constructed in the code.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
