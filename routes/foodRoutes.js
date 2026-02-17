import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

/* ---------------- GET FOODS (SEARCH) ---------------- */
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search && search.trim() !== "") {
      filter.name = {
        $regex: `\\b${search.trim()}`,
        $options: "i",
      };
    }

    const foods = await Food.find(filter).limit(10);
    res.json(foods);
  } catch (err) {
    console.error("FOOD FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch foods" });
  }
});

/* ---------------- ADD FOOD ---------------- */
router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const food = new Food({ name, price });
    await food.save();

    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ---------------- DELETE FOOD ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
