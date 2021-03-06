const mongoose = require("mongoose");
const continents = require("../config/continents");
const slug = require("mongoose-slug-generator");

const options = {
  lang: "en",
};
mongoose.plugin(slug, options);

const tourSchema = mongoose.Schema(
  {
    tourName: {
      type: String,
      minlength: 0,
      maxlength: 100,
      required: [true, "Tour must have a name!"],
    },
    countryName: {
      type: String,
      minlength: 0,
      maxlength: 100,
      required: [true, "Tour must have a country name!"],
    },
    continent: {
      type: String,
      enum: continents,
    },
    description: {
      type: String,
      minlength: 20,
      maxlength: 1024,
      required: [true, "Tour must have a description!"],
    },
    imageAvatar: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    imageSlide: [
      {
        type: String,
        required: false,
        index: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 500000000,
    },
    ratingsAverage: {
      type: Number,
    },
    timeStart: {
      type: Date,
      required: [true, "Tour must have a time start!"],
    },
    timeEnd: {
      type: Date,
      required: [true, "Tour must have a time end!"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
      default: 50,
    },
    hotelName: {
      type: String,
      minlength: 0,
      maxlength: 100,
      required: [true, "Tour must have a hotel name!"],
    },
    schedule: {
      type: String,
      minlength: 20,
      maxlength: 1024,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 0.7,
      default: 0,
    },
    typePlace: {
      type: mongoose.Schema.ObjectId,
      ref: "TypePlace",
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Tour must belong to owner!"],
    },
    slug: {
      type: String,
      slug: "tourName",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.pre("save", function (next) {
  this.actualPrice = this.price * (1 - this.discount);
  next();
});

tourSchema.virtual("actualPrice").get(function () {
  return this.price * (1 - this.discount);
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
