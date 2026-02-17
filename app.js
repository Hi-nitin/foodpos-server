// server/index.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from 'mongoose'; 
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

// ---------------- MONGODB ----------------
connectDB();

// ---------------- EXPRESS APP ----------------
const app = express();
app.use(express.json());

// ---------------- CORS ----------------
// Allow both local dev and deployed front-end
const FRONTEND_URL = "https://foodpos-eight.vercel.app";
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ---------------- API ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/recipes", recipeRoutes);

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 Server is running!",
    db: mongoose.connection.readyState === 1 ? "connected" : "not connected",
  });
});

// ---------------- SOCKET.IO ----------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL], // allow dev + deployed client
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("orderUpdated", () => {
    io.emit("refreshOrders");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
