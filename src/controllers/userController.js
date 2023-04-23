const User = require("../models/userModel");
const { userSchema } = require("../validators/schema-validator");
const createError = require("http-errors");

exports.getUserAddress = (req, res, next) => {
  const address = req.user.address;
  if (!address) {
    return next(createError(404, "Address not found"));
  }
  res.status(200).json(address);
};

exports.updateAddress = async (req, res, next) => {
  const user = req.user;
  const address = req.body;
  try {
    const updatedUserObject = await User.findByIdAndUpdate(
      { _id: user.id },
      { address },
      {
        new: true,
        runValidators: true,
        context: "query",
        useFindAndModify: false,
      }
    );
    res.status(200).json(updatedUserObject);
  } catch (error) {
    console.log("Error at update address user controller", error);
    next(createError(error));
  }
};

exports.getUserById = (req, res, next) => {
  res.status(200).json(req.user);
};

exports.fetchById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    req.user = user;
  } catch (error) {
    console.log("Error occured at fetchById middleware of user", error);
    next(error);
  }
};

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
