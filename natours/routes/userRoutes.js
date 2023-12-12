// routes/userRoutes.js

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Routes for user signup, login, logout, password reset, and update
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware (authentication required for subsequent routes)
router.use(authController.protect);

// Routes for updating user's password and managing user's own profile
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// Restrict following routes to admin users
router.use(authController.restrictTo('admin'));

// Routes for managing all users
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// Routes for getting, updating, and deleting a specific user by ID
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
