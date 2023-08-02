const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync.js");
const {
	validateReview,
	isLoggedIn,
	isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

reviewRouter.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(reviewController.createReview)
);

reviewRouter.delete(
	"/:reviewid",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviewController.deleteReview)
);

module.exports = reviewRouter;
