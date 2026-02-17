import express from "express";
import Recipe from "../models/Recipe.js";
import Food from "../models/Food.js";
import multer from "multer";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: "dska3vjh2",
  api_key: "516759773922972",
  api_secret: "GiyNIAjyaTnQIACX465GPCAxe88",
  secure: true,
});

// ---------------- MULTER ----------------
const upload = multer(); // memory storage, no disk

// ---------------- CLOUDINARY UPLOAD HELPER ----------------
const uploadToCloudinary = (fileBuffer, folder = "recipes") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    });
    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(stream);
  });

// ---------------- CREATE RECIPE ----------------
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { title, food, steps } = req.body;

    // Check required
    if (!title || !food || !steps) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Recipe.findOne({ food });
    if (existing)
      return res.status(400).json({ message: "Recipe exists for this food" });

    // Parse steps
    let parsedSteps = JSON.parse(steps); // [{ desc: "Step 1" }, ...]

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        if (parsedSteps[i]) {
          const url = await uploadToCloudinary(req.files[i].buffer);
          parsedSteps[i].image = url;
        }
      }
    }

    const recipe = new Recipe({
      title,
      food,
      steps: parsedSteps,
    });

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error("CREATE RECIPE ERROR:", err);
    res.status(500).json({ message: "Failed to create recipe", error: err.message });
  }
});

// ---------------- GET RECIPE BY FOOD ----------------
router.get("/food/:foodId", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ food: req.params.foodId });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
});

// ---------------- GET ALL RECIPES ----------------
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("food");
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

export default router;
