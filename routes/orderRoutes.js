import express from "express";
import Order from "../models/Order.js";
import Table from "../models/Table.js";

const router = express.Router();

const FIXED_GROUPS = ["G1", "G2", "G3", "G4"];

/* =========================================================
   GET ACTIVE ORDERS (ADMIN / KITCHEN)
   ========================================================= */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["draft", "sent"] }
    })
      .populate("tableId") // ✅ needed for admin view
      .sort({ createdAt: 1 });

    res.json(orders);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* =========================================================
   ADD / UPDATE ORDER (WAITER SEND)
   ========================================================= */
router.post("/", async (req, res) => {
  try {
    const { tableId, groupName, items } = req.body;

    // ✅ basic validation
    if (!tableId || !groupName || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    if (!FIXED_GROUPS.includes(groupName)) {
      return res.status(400).json({ message: "Invalid group name" });
    }

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    // 🔑 ONE ACTIVE ORDER PER TABLE + GROUP
    let order = await Order.findOne({
      tableId,
      groupName,
      status: { $in: ["draft", "sent"] }
    });

    if (!order) {
      order = new Order({
        tableId,
        groupName,
        items,
        status: "sent"
      });
    } else {
      // ✅ merge items
      order.items.push(...items);
      order.status = "sent";
    }

    await order.save();

    const io = req.app.get("io");
    if (io) io.emit("refreshOrders");

    res.json(order);
  } catch (err) {
    console.error("SEND ORDER ERROR:", err);
    res.status(500).json({ message: "Send order failed" });
  }
});

/* =========================================================
   COMPLETE ORDER (AFTER BILLING)
   ========================================================= */
router.put("/:orderId/complete", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "completed";
    await order.save();

    const io = req.app.get("io");
    if (io) io.emit("refreshOrders");

    res.json(order);
  } catch (err) {
    console.error("COMPLETE ORDER ERROR:", err);
    res.status(500).json({ message: "Complete failed" });
  }
});

/* =========================================================
   REMOVE SINGLE ITEM FROM ORDER
   ========================================================= */
router.delete("/:orderId/item/:itemId", async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.items = order.items.filter(
      item => item._id.toString() !== itemId
    );

    // 🔥 delete order if empty
    if (order.items.length === 0) {
      await Order.findByIdAndDelete(orderId);
    } else {
      await order.save();
    }

    const io = req.app.get("io");
    if (io) io.emit("refreshOrders");

    res.json({ success: true });
  } catch (err) {
    console.error("REMOVE ITEM ERROR:", err);
    res.status(500).json({ message: "Remove item failed" });
  }
});

/* =========================================================
   DELETE FULL ORDER (CANCEL TABLE/GROUP)
   ========================================================= */
router.delete("/:orderId", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);

    const io = req.app.get("io");
    if (io) io.emit("refreshOrders");

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ORDER ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
