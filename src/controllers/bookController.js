const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");

const {
  isValidObjectId,
  isValidRequestBody,
  isValid,
  checkName,
  checkISBN,
  checkreleasedAt,
} = require("../Validations/validations");

//-------------------------------------------------------Create Book ------------------------------------------------------------------------------

const createBooks = async function (req, res) {
  try {
    let data = req.body;
    let { title, excerpt, userId, ISBN, genre, releasedAt } = data;
    console.log(data);
    if (!isValidRequestBody(data))
      return res
        .status(400)
        .send({ status: false, message: "please enter books details" });

    if (!isValid(title))
      return res.status(400).send({
        status: false,
        message: "use correct title which is mandatory ",
      });
    console.log(title);

    if (!isValid(excerpt))
      return res.status(400).send({
        status: false,
        message: "please Enter the excerpt or excerpt can not be Empty ",
      });
    // if (!checkName(excerpt)) return res.status(400).send({ status: false, message: "Please enter valid excerpt" })

    if (!isValid(userId))
      return res
        .status(400)
        .send({ status: false, message: "please use userId" });
    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "please use correct userId" });

    if (!isValid(ISBN))
      return res.status(400).send({
        status: false,
        message: "use correct ISBN or ISBN is Mandetory",
      });
    if (!checkISBN(ISBN))
      return res
        .status(400)
        .send({ status: false, message: "please enter valid ISBN" });

    let checkTitleAndISBN = await bookModel.findOne({
      $or: [{ title: title }, { ISBN: ISBN }],
    });
    console.log(checkTitleAndISBN);
    if (checkTitleAndISBN) {
      console.log("Error ithe yet ahet");
      if (checkTitleAndISBN.title == title)
        return res
          .status(409)
          .send({ status: false, message: "Title already exist" });
      if (checkTitleAndISBN.ISBN == ISBN)
        return res
          .status(409)
          .send({ status: false, message: "ISBN alarady exist" });
    }

    if (!isValid(genre))
      return res
        .status(400)
        .send({ status: false, message: "Please enter category" });
    if (!checkName(genre))
      return res.status(400).send({
        status: false,
        message: "Please enter valid formant of subcategory",
      });

    if (!isValid(releasedAt))
      return res
        .status(400)
        .send({ status: false, message: "Please enter releasedAt" });
    if (!checkreleasedAt(releasedAt))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid released date" });

    let createBook = await bookModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Book created successfully",
      data: createBook,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// ---------------------------------------------Get All Books ----------------------------------------------------------------------------------

const getBooksByfilter = async function (req, res) {
  try {
    let data = req.query;
    console.log("qurey data : ", data);

    let { author, genre, page = 1, limit = 10 } = data;
    let filter = {};

    console.log(data);
    if (!author == author || author == "")
      return res
        .status(400)
        .send({ status: false, message: "Use Correct Author name" });
    if (author) {
      if (!checkName(author))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid author name" });
      filter.author = author;
    }

    if (!genre == genre || genre == "")
      return res
        .status(400)
        .send({ status: false, message: "Use correct genre" });
    if (genre) {
      if (!checkName(genre))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid genre" });
      filter.genre = genre;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (author || genre) {
      let books = await bookModel
        .find(filter)
        .select({
          _id: 1,
          title: 1,
          author: 1,
          excerpt: 1,
          genre: 1,
          releasedAT: 1,
          reviews: 1,
        })
        .collation({ locale: "en" })
        .sort({ title: 1 })
        .skip(skip)
        .limit(parseInt(limit));
      if (Object.keys(books).length == 0)
        return res.status(400).send({
          status: false,
          message: "There is no data with this filter",
        });
      return res.status(200).send({
        status: true,
        message: "All Books",
        count: books.length,
        data: books,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "The filter can be only author or genre",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// ----------------------------------------------Get books by userID-----------------------------------------------------------------------

const getBooksById = async function (req, res) {
  try {
    const bookId = req.params.bookId;

    if (!isValidObjectId(bookId))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid Book Id" });

    const bookDetails = await bookModel.findOne({ _id: bookId });
    if (!bookDetails)
      return res.status(400).send({ status: fasle, message: "Book not found" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const allReviews = await reviewModel.find({ bookId });
    const paginatedReviews = allReviews.slice(skip, skip + limit);
    console.log(allReviews.length);
    let avgRating = 0;
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      console.log("Total rating : ", totalRating);
      avgRating = (totalRating / allReviews.length).toFixed(2);
      console.log(avgRating);
    }

    const book = bookDetails._doc;
    book.reviewData = paginatedReviews;
    book.avgRating = avgRating;
    book.totalReviews = allReviews.length;

    return res
      .status(200)
      .send({ status: true, message: "Book details with reviews", data: book });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// ----------------------------------------------------------Search API --------------------------------------------------------------------------------------------
const search = async function (req, res) {
  try {
    let data = req.query;
    console.log("qurey data : ", data);

    let { author, title } = data;
    let filter = {};

    if (!author == author || author?.trim() == "")
      return res
        .status(400)
        .send({ status: false, message: "Use Correct Author name" });
    if (author) {
          filter.author = { $regex: author?.trim(), $options: "i" };
     
    }

    if (!title == title || title?.trim() == "")
      return res
        .status(400)
        .send({ status: false, message: "Use correct title" });
    if (title) {
      filter.title = { $regex: title?.trim(), $options: "i" };
    }

    if (author || title) {
      let books = await bookModel
        .find(filter)
        .select({
          _id: 1,
          title: 1,
          author: 1,
          excerpt: 1,
          genre: 1,
          releasedAT: 1,
          reviews: 1,
        })
        .collation({ locale: "en" })
        .sort({ title: 1 });

      if (Object.keys(books).length == 0)
        return res.status(400).send({
          status: false,
          message: "There is no data with this filter",
        });
      return res.status(200).send({
        status: true,
        message: "All Books",
        data: books,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Please provide filters for search",
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createBooks, getBooksByfilter, getBooksById, search };
