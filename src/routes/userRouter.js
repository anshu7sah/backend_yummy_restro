const express = require("express");
const { createUser } = require("../controllers/userController.js");
const { jwtCheck } = require("../auth/jwt-checker.js");
const router = express.Router();

router.post("/users", jwtCheck, createUser);

module.exports = router;
