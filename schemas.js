const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escapedHTML": "{{#label}} must not include HTML",
	},
	rules: {
		escapedHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error("string.escapedHTML", { value });
				return clean;
			},
		},
	},
});

const Joi = BaseJoi.extend(extension);

const campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required().escapedHTML(),
		price: Joi.number().required().min(0),
		// image: Joi.string().required(),
		location: Joi.string().required().escapedHTML(),
		description: Joi.string().required().escapedHTML(),
	}).required(),
	deletedImages: Joi.array(),
});

const reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(1).max(5),
		body: Joi.string().required().escapedHTML(),
	}).required(),
});

module.exports = { campgroundSchema, reviewSchema };
