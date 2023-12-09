// utils/catchAsync.js

/**
 * A higher-order function to wrap async route handlers and pass errors to Express's error handling middleware.
 * 
 * By wrapping async functions with catchAsync, we avoid the need for try/catch blocks in each async function.
 * Instead, any thrown error is forwarded to Express's next() function, invoking the error handling middleware.
 *
 * @param {Function} fn - An asynchronous function representing an Express route handler.
 * @returns {Function} A function that executes the passed async function and catches any errors.
 */

module.exports = fn => {
  return (req, res, next) => {
    // Wrapping the async function in a promise chain
    fn(req, res, next).catch(next); // Any thrown error is passed to next(), triggering error handling
  };
};

