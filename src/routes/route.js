const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const authentication = require('../middleware/auth');

router.post("/register", userController.createUser);
router.post('/login',userController.userLogin);

router.post("/books",authentication,bookController.createBooks );
router.get("/books",authentication,bookController.getBooksByfilter);
router.get("/books/:bookId",authentication, bookController.getBooksById);
router.get("/search", authentication,bookController.search)

router.post("/review/:bookId", authentication, reviewController.createReview);
router.put("/reviews/:reviewId", authentication, reviewController.updateReview);
router.delete("/reviews/:reviewId",authentication, reviewController.deleteReview);
module.exports = router