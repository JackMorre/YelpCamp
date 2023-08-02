const Campground = require("../models/campground.js");
const cloudinary = require("../cloudinary/index.js");
const mapboxSdk = require("@mapbox/mapbox-sdk/services/geocoding.js");

const mapboxToken = process.env.MAPBOX_TOKEN;

var mapboxClient = mapboxSdk({ accessToken: mapboxToken });

const campgroundController = {
	index: async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	},
	renderNewForm: (req, res) => {
		res.render("campgrounds/new");
	},
	createCampground: async (req, res, next) => {
		const geoData = await mapboxClient
			.forwardGeocode({
				query: req.body.campground.location,
				limit: 1,
			})
			.send();
		const newProduct = new Campground(req.body.campground);
		newProduct.geometry = geoData.body.features[0].geometry;
		newProduct.images = req.files.map((f) => ({
			url: f.path,
			fileName: f.filename,
		}));
		newProduct.author = req.user._id;
		await newProduct.save();
		console.log(newProduct);
		req.flash("success", "Successfully created a new campground");
		res.redirect(`/campgrounds/${newProduct._id}`);
	},
	showCampground: async (req, res) => {
		const foundCampground = await Campground.findById(req.params.id)
			.populate({ path: "reviews", populate: { path: "author" } })
			.populate("author");
		if (!foundCampground) {
			req.flash("error", "Can't find that campground");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/show", { foundCampground });
	},
	renderEditForm: async (req, res) => {
		const { id } = req.params;
		const foundCampground = await Campground.findById(id);
		if (!foundCampground) {
			req.flash("error", "Can't find that campground");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", { foundCampground });
	},
	updateCampground: async (req, res) => {
		const { id } = req.params;
		console.log(req.body);
		const found = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		const imgs = req.files.map((f) => ({
			url: f.path,
			fileName: f.filename,
		}));
		found.images.push(...imgs);
		await found.save();
		if (req.body.deletedImages) {
			for (let img of req.body.deletedImages) {
				await cloudinary.uploader.destroy(img);
			}
			await found.updateOne({
				$pull: { images: { fileName: { $in: req.body.deletedImages } } },
			});
			console.log(found);
		}
		req.flash("success", "Update Successful");
		res.redirect(`/campgrounds/${found._id}`);
	},
	deleteCampground: async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Successfully deleted campground");
		res.redirect("/campgrounds");
	},
};

module.exports = campgroundController;
