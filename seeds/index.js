if (process.env.NODE_ENV !== "production") {
	require("dotenv/config");
}

const express = require("express");
const mongoose = require("mongoose");
const Cities = require("./cities.js");
const { descriptors, places } = require("./seedHelpers.js");
const path = require("path");
const { fileURLToPath } = require("url");
const Campground = require("../models/campground.js");
const url = process.env.DB_URL

mongoose.connect(url);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("database connected");
});

const sample = function (arr) {
	return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 400; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 30) + 10;
		const camp = new Campground({
			author: "64c9585260098c1211b747e7",
			location: `${Cities[random1000].city}, ${Cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			geometry: {
				type: "Point",
				coordinates: [
					Cities[random1000].longitude,
					Cities[random1000].latitude,
				],
			},
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, at omnis dolor vel nobis soluta accusantium assumenda expedita? Ad pariatur quasi voluptates reprehenderit error veritatis reiciendis? In omnis ratione voluptatibus.",
			price,
			images: [
				{
					url: "https://res.cloudinary.com/dazykjfol/image/upload/v1689318361/YelpCamp/l1hs30w9smelsrze20br.jpg",
					fileName: "YelpCamp/l1hs30w9smelsrze20br",
				},
				{
					url: "https://res.cloudinary.com/dazykjfol/image/upload/v1689318361/YelpCamp/fedls2uyhireslwujb2t.jpg",
					fileName: "YelpCamp/fedls2uyhireslwujb2t",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
