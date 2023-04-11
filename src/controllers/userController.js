const User = require("../models/userModel");
const { userSchema } = require("../validators/schema-validator");
const createError = require("http-errors");

exports.createUser = async (req, res, next) => {
  console.log(req.auth);
  let user;
  try {
    const result = await userSchema.validateAsync(req.body);
    user = new User(result);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    if (error.message.includes("E11000")) {
      return next(
        createError.Conflict(`User with email ${user.email} already exists`)
      );
    }
    console.log("Error at creating user in create User controller", error);
    next(error);
  }
};
