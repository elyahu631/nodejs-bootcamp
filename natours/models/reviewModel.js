// models/reviewModel.js

// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    // Timestamp for when the review was created, defaults to current date
    createdAt: {
      type: Date,
      default: Date.now
    },
    // Reference to the tour the review belongs to, required
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    // Reference to the user who created the review, required
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  // Enable virtuals for JSON and object representations
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create an index for uniqueness of reviews per tour and user
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Populate the 'user' field with user data before any 'find' operation
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

// Static method to calculate and update average ratings for a tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // Count the number of ratings
        avgRating: { $avg: '$rating' } // Calculate the average rating
      }
    }
  ]);

  if (stats.length > 0) {
    // Update the tour document with the calculated statistics
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    // If there are no reviews for the tour, set default values
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5 // Default average rating
    });
  }
};

// Middleware to calculate average ratings after saving a new review
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// Middleware to capture the current review before updating or deleting
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

// Middleware to update average ratings after updating or deleting a review
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
