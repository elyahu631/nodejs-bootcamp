// controllers/handlerFactory.js

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

/**
 * Factory function to delete one document from the specified model.
 * @param {Model} Model - The Mongoose model to perform the deletion on.
 * @returns {Function} - The asynchronous function to handle the deletion.
 */
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    // If no document found, return an error
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // Send a success response with no data (204 No Content)
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

/**
 * Factory function to update one document in the specified model.
 * @param {Model} Model - The Mongoose model to perform the update on.
 * @returns {Function} - The asynchronous function to handle the update.
 */
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true // Run validation on update
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404)); //(404 Not Found)
    }

    // Send a success response with the updated data (200 OK)
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/**
 * Factory function to create one document in the specified model.
 * @param {Model} Model - The Mongoose model to create a new document in.
 * @returns {Function} - The asynchronous function to handle the creation.
 */
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {

    // Create a new document using the request body data
    const doc = await Model.create(req.body);

    // Send a success response with the created data (201 Created)
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/**
 * Factory function to get one document from the specified model.
 * @param {Model} Model - The Mongoose model to retrieve a document from.
 * @param {Object} popOptions - Options for populating related fields.
 * @returns {Function} - The asynchronous function to handle the retrieval.
 */
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    // If popOptions provided, populate related fields
    if (popOptions) query = query.populate(popOptions);

    // Execute the query to retrieve the document
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/**
 * Factory function to get all documents from the specified model.
 * @param {Model} Model - The Mongoose model to retrieve documents from.
 * @returns {Function} - The asynchronous function to handle the retrieval of all documents.
 */
exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Apply filtering, sorting, field limiting, and pagination to the query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query to retrieve the documents
    const doc = await features.query;

    // Send a success response with the retrieved data
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
