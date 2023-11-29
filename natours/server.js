// server.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handling uncaught exceptions at the top level
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1); // Exit process immediately
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Replacing the placeholder in the DB connection string with the actual password
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to the MongoDB database
mongoose
  .connect(DB) 
  .then(() => console.log('DB connection successful!'))

// Starting the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handling unhandled promise rejections (e.g., MongoDB connection issues)
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1); // Exit process after server closes
  });
});