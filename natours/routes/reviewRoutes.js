// routes/reviewRoutes.js

const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes in this router, ensuring user authentication
router.use(authController.protect);

// Define routes for handling reviews
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'), // Only allow users to post reviews
    reviewController.setTourUserIds, // Set the tour and user IDs for the review
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'), // Only allow users and admins to update reviews
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'), // Only allow users and admins to update reviews
    reviewController.deleteReview
  );

module.exports = router;
