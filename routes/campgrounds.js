const express = require("express");
const campgroundsRouter = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const campgroundController = require("../controllers/campgrounds.js");
const multer = require("multer");
const { storage } = require("../cloudinary/index.js");
const upload = multer({ storage: storage });

const {
	isLoggedIn,
	validateCampground,
	isAuthor,
	returnTo,
} = require("../middleware.js");

campgroundsRouter
	.route("/")
	.get(catchAsync(campgroundController.index))
	.post(
		isLoggedIn,
		upload.array("image"),
		validateCampground,
		catchAsync(campgroundController.createCampground)
	);
campgroundsRouter.get(
	"/new",
	returnTo,
	isLoggedIn,
	campgroundController.renderNewForm
);

campgroundsRouter
	.route("/:id")
	.get(returnTo, catchAsync(campgroundController.showCampground))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array("image"),
		validateCampground,
		catchAsync(campgroundController.updateCampground)
	)
	.delete(
		isLoggedIn,
		isAuthor,
		catchAsync(campgroundController.deleteCampground)
	);

campgroundsRouter.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(campgroundController.renderEditForm)
);

module.exports = campgroundsRouter;
