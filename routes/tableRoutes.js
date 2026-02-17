import express from "express";
import Table from "../models/Table.js";

const router = express.Router();

/* ---------------- ADD TABLE ---------------- */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Table.findOne({
      name: new RegExp(`^${name}$`, "i")
    });

    if (exists) {
      return res.status(400).json({ message: "Table already exists" });
    }

    const table = new Table({ name });
    await table.save();

    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ---------------- GET ALL TABLES ---------------- */
router.get("/", async (req, res) => {
  const tables = await Table.find().sort({ name: 1 });
  res.json(tables);
});

/* ---------------- DELETE TABLE ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Table deleted" });
  } catch (err) {
    console.error("DELETE TABLE ERROR:", err);
    res.status(500).json({ message: "Failed to delete table" });
  }
});

export default router;
