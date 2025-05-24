const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      //name of the book
    },
    author:{
      type:String,
      required:true,
      trime:true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      //short summary or extract of the book
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      //international standard book number of identifying book
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      //category like fictin, science etc
    },
    reviews: {
      type: Number,
      default: 0,
      //number of reviews
    },
    releasedAt: {
      type: String,
      required: true,
      trim: true,
      //date of book released
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
