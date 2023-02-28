const Dish = require("../models/dishModel");
const mongoose = require("mongoose");
const createError = require("http-errors");
const { dishSchema } = require("../validators/schema-validator");
const imageTypes = ["image/jpg", "image/png", "image/jpeg", "image/gif"];

exports.createDish = async (req, res, next) => {
  const { name, description, price, category, photo } = req.body;
  let dish;
  try {
    const result = await dishSchema.validateAsync({
      name,
      description,
      price,
      category,
    });
    dish = new Dish({ name, description, price, category });
    dish.addedBy = "Anshu";
    savePhoto(dish, photo);
    const newDish = await dish.save();
    newDish.photo = undefined;
    res.status(201).json(newDish);
  } catch (error) {
    console.log("Errro in create Dish", error);
    if (error.isJoi === true) {
      error.status = 422;
    }
    if (error.message.includes("E11000")) {
      return next(createError.Conflict(`The dish ${dish.name} already exists`));
    }
    next(error);
  }
};

function savePhoto(dish, photo) {
  //TODO: Handle empty object scenario
  if (photo != null && imageTypes.includes(photo.type)) {
    dish.photo.data = new Buffer.from(photo.data, "base64");
    dish.photo.contentType = photo.type;
  }
}

exports.fetchDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find().select("-photo").populate("category", {
      name: 1,
      _id: 1,
    });
    if (dishes.length === 0) throw createError(400, "No Dishes found");

    res.status(200).json(dishes);
  } catch (error) {
    console.log("Error Occured at Fetch Dishes controller", error);
    next(error);
  }
};

exports.fetchDish = async (req, res, next, id) => {
  try {
    const dish = await Dish.findById(id);
    if (!dish) throw createError(404, `Dish with id ${id} not found`);
    req.dish = dish;
    next();
  } catch (error) {
    console.log("Fetch Dish error", error);
    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid Dish id"));
    }
    next(error);
  }
};

exports.fetchDishById = (req, res) => {
  req.dish.photo = undefined;
  res.status(200).json(req.dish);
};

exports.getDishPhoto = (req, res) => {
  const dish = req.dish;
  if (dish.photo && dish.photo.data) {
    res.set("Content-Type", dish.photo.contentType);
    res.send(dish.photo.data);
  } else {
    res.status(204).json({ message: "No data found" });
  }
};

exports.searchByCategory = async (req, res, next) => {
  let { categories } = req.body;
  let criteria = {};
  try {
    if (categories.length === 0) {
      return next(createError(404, "No category specified"));
    }
    criteria = { category: { $in: categories } };
    const result = await Dish.find(criteria)
      .select("-photo")
      .populate("category", {
        name: 1,
        _id: 1,
      });
    res.status(200).json(result);
  } catch (error) {
    console.log("Error Occured at searchByCategory in dish controller", error);
    next(error);
  }
};
