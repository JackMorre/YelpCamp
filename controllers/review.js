const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

const reviewController = {
	createReview: async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash("success", "New review created!");
		res.redirect(`/campgrounds/${campground._id}`);
	},
	deleteReview: async (req, res) => {
		const { id, reviewid } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
		await Review.findByIdAndDelete(reviewid);
		req.flash("success", "Successfully deleted review");
		res.redirect(`/campgrounds/${id}`);
	},
};

module.exports = reviewController;
