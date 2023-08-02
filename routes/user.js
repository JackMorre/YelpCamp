const express = require("express");
const userRouter = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const passport = require("passport");
const { storeReturnTo } = require("../middleware.js");
const userController = require("../controllers/user.js");

userRouter.get("/register", userController.renderRegisterForm);

userRouter.post("/register", catchAsync(userController.registerUser));

userRouter.get("/login", userController.renderLogInForm);
userRouter.post(
	"/login",
	storeReturnTo,
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	userController.logInUser
);

userRouter.get("/logout", userController.logOutUser);

module.exports = userRouter;
