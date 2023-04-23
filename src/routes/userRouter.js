const express = require("express");
const {
  createUser,
  fetchById,
  getUserById,
  updateAddress,
  getUserAddress,
} = require("../controllers/userController.js");
const { jwtCheck } = require("../auth/jwt-checker.js");
const router = express.Router();

router.post("/users", jwtCheck, createUser);

router.param("id", fetchById);

router.get("/users/:id", jwtCheck, getUserById);

router.put("/users/:id/address", jwtCheck, updateAddress);

router.get("/users/:id/address", jwtCheck, getUserAddress);

module.exports = router;
