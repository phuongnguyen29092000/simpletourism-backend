const cookieSession = require("cookie-session");
const { Tour } = require("../models");
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "typeplace",
      "discount",
    ];
    excludedFields.forEach((element) => delete queryObj[element]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query
      .find(JSON.parse(queryStr))
      .populate({ path: "typePlace" });

    return this;
  }

  typePlace(typePlaceQuery, tours) {
    const arrTypePlace = typePlaceQuery.split(",");
    const res = [];
    tours.forEach((item) => {
      if (arrTypePlace.includes(item.typePlace.slug)) {
        res.push(item);
      }
    });
    return res;
  }

  discount() {
    if (this.queryString.discount == "true") {
      this.query = this.query
        .find({ discount: { $gt: 0 } })
        .populate({ path: "typePlace" });
    } else if (this.queryString.discount == "false") {
      this.query = this.query
        .find({ discount: { $eq: 0 } })
        .populate({ path: "typePlace" });
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy).populate("typePlace owner");
    }
    return this;
  }

  fieldLimit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields).populate("typePlace owner");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query
      .skip(skip)
      .limit(limit)
      .populate("typePlace owner");
    return this;
  }
}

module.exports = APIFeatures;
