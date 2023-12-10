// app.js
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers using the Helmet middleware
app.use(helmet());

// Development logging using morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from the same API using express-rate-limit middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body with a limit of 10kb
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection using express-mongo-sanitize middleware
app.use(mongoSanitize());

// Data sanitization against cross-site scripting (XSS) attacks using xss-clean middleware
app.use(xss());

// Prevent parameter pollution using hpp middleware with a whitelist of allowed parameters
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serve static files from the 'public' directory
app.use(express.static(`${__dirname}/public`));

// Test middleware to add a timestamp to the request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 3) HANDLE UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
