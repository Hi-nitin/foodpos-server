// server/routes/subCategoryRoutes.js
import express from "express";
import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";
import Food from "../models/Food.js";
const router = express.Router();

/* ---------------- GET ALL SUBCATEGORIES ---------------- */
router.get("/", async (req, res) => {
  try {
    const subcategories = await SubCategory.find()
      .populate("category") // Populate the category info
      .sort({ name: 1 });

    res.json(subcategories);
  } catch (err) {
    console.error("FETCH SUBCATEGORY ERROR:", err);
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
});

/* ---------------- GET SUBCATEGORIES BY CATEGORY ---------------- */
// server/routes/subcategoryRoutes.js

router.get("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params; // use the correct param
    const subcategories = await SubCategory.find({ category: categoryId });
    res.json(subcategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subcategories by category" });
  }
});



/* ---------------- DELETE SUBCATEGORY ---------------- */
router.delete("/:id", async (req, res) => {

  
  try {
    const subId = req.params.id;

    // ❌ Prevent delete if foods exist
    const foodExists = await Food.findOne({ subcategory: subId });
    if (foodExists) {
      return res.status(400).json({
        message: "Subcategory has foods",
      });
    }

    await SubCategory.findByIdAndDelete(subId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete subcategory" });
  }
});



/* ---------------- ADD SUBCATEGORY ---------------- */
router.post("/", async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: "Subcategory name and category are required"
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prevent duplicate subcategory for the same category
    const exists = await SubCategory.findOne({
      name: new RegExp(`^${name}$`, "i"),
      category
    });

    if (exists) {
      return res.status(400).json({
        message: "Subcategory already exists for this category"
      });
    }

    const subcategory = new SubCategory({
      name,
      category
    });

    await subcategory.save();

    // Populate category before sending response
    await subcategory.populate("category");

    res.json(subcategory);
  } catch (err) {
    console.error("ADD SUBCATEGORY ERROR:", err);
    res.status(500).json({ message: "Failed to add subcategory" });
  }
});

export default router;
