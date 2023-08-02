const { Review } = require("./models/review.js");
const  Campground  = require("./models/campground.js");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const { ExpressError } = require("./utils/expressError.js");

const returnTo = (req, res, next) => {
	req.session.returnTo = req.originalUrl;
	next();
};

const isLoggedIn = (req, res, next) => {
	// console.log("req.user..", req.user);
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You need to be logged in");
		return res.redirect("/login");
	}
	next();
};

const storeReturnTo = (req, res, next) => {
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
};

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

const isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const found = await Campground.findById(id);
	if (!found.author.equals(req.user._id)) {
		req.flash("error", "You don't have permission to edit this campground!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

const isReviewAuthor = async (req, res, next) => {
	const { id, reviewid } = req.params;
	const found = await Review.findById(reviewid);
	if (!found.author.equals(req.user._id)) {
		req.flash("error", "You don't have permission to delete this review");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports = {
	isLoggedIn,
	storeReturnTo,
	isAuthor,
	validateCampground,
	validateReview,
	isReviewAuthor,
	returnTo,
};
