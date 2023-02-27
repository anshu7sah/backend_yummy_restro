const express = require("express");
const router = express.Router();
const {
  fetchAllCategories,
  createCategoryController,
  getCategoryId,
  getCategory,
} = require("../controllers/categoryController");

router.get("/categories", fetchAllCategories);

router.post("/categories", createCategoryController);

router.param("id", getCategoryId);
router.get("/categories/:id", getCategory);

module.exports = router;
