// utils/apiFeatures.js

/*APIFeatures class provides methods for filtering, sorting, limiting fields,
 and paginating data in a query. */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // The Mongoose query object
    this.queryString = queryString; // The query string from the URL
  }

  // Filter the query based on the query string parameters
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering: Convert query string operators to MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // Apply the filtered query to the class property
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Sort the query results based on the 'sort' query string parameter
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sorting by creation date if no 'sort' parameter is provided
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // Limit the fields returned in the query results based on the 'fields' query string parameter
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Default to excluding '__v' field if no 'fields' parameter is provided
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // Paginate the query results based on the 'page' and 'limit' query string parameters
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    
    // Apply pagination to the query
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
