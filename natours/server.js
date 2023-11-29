// server.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB) // Make sure to replace 'DB' with your actual connection string
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
    console.error('DB connection error:', err.message);
    process.exit(1); // Optionally exit the process with failure code
  });

const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
