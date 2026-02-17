// server/routes/categoryRoutes.js
import express from "express";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import Food from "../models/Food.js";
const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Add category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add category" });
  }
});

/* ---------------- DELETE CATEGORY ---------------- */
router.delete("/:id", async (req, res) => {

  try {
    const categoryId = req.params.id;
    

    // ❌ Prevent delete if subcategories exist
    const subExists = await SubCategory.findOne({ category: categoryId });
    if (subExists) {
         
      return res.status(400).json({
        message: "Delete subcategories first",
      });
    }

    // ❌ Prevent delete if foods exist
    const foodExists = await Food.findOne({ category: categoryId });
    if (foodExists) {
      
      return res.status(400).json({
        message: "Category has foods",
      });
    }

    await Category.findByIdAndDelete(categoryId);
    
    res.json({ success: true });
  } catch (err) {

    res.status(500).json({ message: "Failed to delete category" });
  }
});


export default router;
