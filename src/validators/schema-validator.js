const joi = require("joi");

const categorySchema = joi.object({
  name: joi.string().required().min(5).max(25),
});

const dishSchema = joi.object({
  name: joi.string().required().min(5),
  description: joi.string().required().min(10).max(150),
  price: joi.number().required(),
  category: joi.string().required(),
});

const userSchema = joi.object({
  _id: joi.string().required(),
  email: joi.string().email().required(),
});
module.exports = { categorySchema, dishSchema, userSchema };
