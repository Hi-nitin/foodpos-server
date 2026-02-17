import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register (optional)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  res.json({ user });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json("Invalid password");

  const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
    expiresIn: "1d"
  });

  res.json({ user, token });
});

export default router;
