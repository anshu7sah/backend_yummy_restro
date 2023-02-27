const Category = require("../models/categoryModel");
const createError = require("http-errors");
const { categorySchema } = require("../validators/schema-validator");
const mongoose = require("mongoose");

exports.fetchAllCategories = async (req, res, next) => {
  try {
    const result = await Category.find({});
    if (result.length === 0) {
      return next(createError(404, "No categories found"));
    }
    res.status(200).json(result);
  } catch (error) {
    console.log("Error in fetching the catagories", error);
    next(error);
  }
};

exports.createCategoryController = async (req, res, next) => {
  try {
    const result = await categorySchema.validateAsync(req.body);
    const category = new Category(result);
    category.addedBy = "npk";
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    if (error.isJoi === true) error.status = 422;
    if (error.message.includes("E11000")) {
      return next(
        createError.Conflict(`Category name ${req.body.name} already exists`)
      );
    }
    next(createError(error));
  }
};

exports.getCategoryId = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    if (!category) return next(createError(404, "Category not found"));
    req.category = category;
    next();
  } catch (error) {
    console.log("Error of getCategory id ", error);
    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid category id"));
    }
    next(error);
  }
};

exports.getCategory = (req, res) => {
  res.status(200).json(req.category);
};
