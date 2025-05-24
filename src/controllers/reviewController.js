const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const {
  isValidObjectId,
  isValid,
  checkName,
  isvalidRating,
  isValidRequestBody,
} = require("../Validations/validations");

const createReview = async function (req, res) {
  try {
    const bookId = req.params.bookId;

    console.log(bookId);

    if (!bookId)
      return res
        .status(400)
        .send({ status: false, message: "Enter bookId in path parameter" });
    if (!isValidObjectId(bookId))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid bookId" });

    const data = req.body;
    if (!isValidRequestBody(data))
      return res
        .status(400)
        .send({ status: false, message: "Please provide review details" });

    const { rating, review } = data;
    data["bookId"] = bookId;
    data["userId"] = req.user._id;
    data["reviewedAt"] = Date.now();

    if (!isvalidRating(rating))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid rating" });
    // if(!checkName(review)) return res.status(400).send({status:false, message:"Please provide valid review"})

    const findBook = await bookModel.findOne({ _id: bookId });
    console.log(findBook);
    if (!findBook)
      return res
        .status(404)
        .send({ status: false, message: "No book found with this book id" });

    const existingReview = await reviewModel.findOne({
      bookId,
      isDeleted: false,
    });
    console.log("review", existingReview);
    if (existingReview)
      return res
        .status(409)
        .send({ status: false, message: "You already reviewed the book" });

    console.log("DATA", data);
    const reviewCreate = await reviewModel.create(data);
    console.log("Created Review: ", reviewCreate);
    const reviewCount = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { $set: { reviews: findBook.reviews + 1 } },
      { new: true }
    );
    console.log("Review count increase : ", reviewCount);
    return res.status(201).send({
      status: true,
      message: "Review created successfully",
      data: { reviewsData: reviewCreate },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// -----------------------------------Update review -------------------------------------------------------------------------------------------------------------------------

const updateReview = async function (req, res) {
  try {
    let data = req.params;
    let { reviewId } = data;
    console.log("reviewId", data);

    if (!isValidObjectId)
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid reviewId" });

    let body = req.body;
    if (!isValidRequestBody(body))
      return res
        .status(400)
        .send({ status: false, message: "Please provide data" });

    let { rating, review } = body;
    console.log(body);

    if (rating) {
      if (!isvalidRating(rating))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid rating" });
    }

    if (!isValid(review))
      return res
        .status(400)
        .send({ status: false, message: "Please enter review" });
    if (!/[a-zA-Z0-9!%/\"]*$/.test(review))
      return res
        .status(400)
        .send({ status: false, message: "Pleae enter valid review" });

    let checkreview = await reviewModel.findOne({ _id: reviewId });
    if (!checkreview)
      return res
        .status(404)
        .send({ status: false, message: "Review not found" });

    if (checkreview.userId.toString() !== req.user._id.toString())
      return res
        .status(403)
        .send({ status: false, message: "User not authorised" });

    if (rating || review) {
      let updateReview = await reviewModel
        .findOneAndUpdate(
          { _id: reviewId, isDeleted: false },
          { $set: body },
          { new: true }
        )
        .select({
          _id: 1,
          bookId: 1,
          userId: 1,
          reviewedAt: 1,
          rating: 1,
          review: 1,
        });
      if (!updateReview)
        return res.status(404).send({
          status: false,
          message: "No review for this reviewId or it may be deleted",
        });

      return res.status(200).send({
        status: true,
        message: "Update successfully",
        data: updateReview,
      });
    } else
      return res.status(400).send({
        status: false,
        message: "update only from  rating, review",
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// ----------------------------------------------Delete Review-------------------------------------------------------------------------

const deleteReview = async function (req, res) {
  try {
    const reviewId = req.params.reviewId;

    if (!isValidObjectId(reviewId))
      return res
        .status(400)
        .send({ status: false, message: "enter valid review Id" });

    let checkReview = await reviewModel.findOne({
      $and: [{ _id: reviewId }, { isDeleted: false }],
    });
    console.log("Check Review:  ", checkReview);
    if (!checkReview) {
      return res.status(404).send({ status: false, message: "Review no present" });
    }
    if (checkReview.userId.toString() !== req.user._id.toString())
      return res
        .status(403)
        .send({ status: false, message: "User not authorised" });

    let deleteReview = await reviewModel.findOneAndUpdate(
      { $and: [{ _id: reviewId }, { isDeleted: false }] },
      { $set: { isDeleted: true } },
      { new: true }
    );

    let reviewBookid = deleteReview.bookId;
   
    let decreaseReview = await bookModel.findOneAndUpdate(
      { $and: [{ _id: reviewBookid }] },
      { $inc: { reviews: -1 } },
      { new: true }
    );
    console.log("Decrease Review sathi Book : ", decreaseReview);
    if (!decreaseReview)
      return res.status(404).send({
        status: false,
        message: "No book found with this bookId or it may be deleted",
      });
    console.log("Decrease review paryant ala", decreaseReview);
    return res.status(200).send({
      status: true,
      message: "deleted successfully",
      deleteReview: deleteReview,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: " server Error", error: err.messag });
  }
};

module.exports = { createReview, updateReview, deleteReview };
