const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: ObjectId,
      required: true,
      ref: "Book",
    },
    userId:{
      type: ObjectId,
      required: true,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      trim: true,
      min:1,
      max:5,
    },
    review: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
