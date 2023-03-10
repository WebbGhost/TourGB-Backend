import { Query } from 'mongoose';

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...this.queryString };
    const exculdedQuery = ['page', 'sort', 'limit', 'feilds'];
    exculdedQuery.forEach((query) => delete queryObject[query]);
    console.log(queryObject, exculdedQuery);
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-name');
    }
    return this;
  }

  feildLimiting() {
    if (this.queryString.feilds) {
      const feilds = this.queryString.feilds.split(',').join(' ');
      this.query = this.query.select(feilds);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const limit = this.queryString.limit * 1 || 100;
    const skip = (this.queryString.page - 1) * this.queryString.limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
export default APIFeatures;
