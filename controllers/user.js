const User = require("../models/user.js");

const userController = {
	renderRegisterForm: (req, res) => {
		res.render("users/register");
	},
	renderLogInForm: (req, res) => {
		res.render("users/login");
	},
	registerUser: async (req, res) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			req.logIn(registeredUser, (err) => {
				if (err) {
					return next(err);
				}
				req.flash("success", "Welcome to yelp-camp!");
				res.redirect("/campgrounds");
			});
		} catch (e) {
			req.flash("error", e.message);
			res.redirect("/register");
		}
	},
	logInUser: (req, res) => {
		req.flash("success", "Welcome back!");
		req.session.regenerate(function (err) {
			if (err) next(err);
			req.session.user = req.user;
			req.session.save();
		});
		const redirectUrl = res.locals.returnTo || "/campgrounds";
		delete res.locals.returnTo;
		res.redirect(redirectUrl);
	},
	logOutUser: (req, res) => {
		req.flash("success", "You have been logged out!");
		req.session.user = null;
		
		req.logOut(function (err) {
				if (err) {
					return next(err);
				}
		});
		;

		res.redirect("/campgrounds");
	},
};

module.exports = userController;
