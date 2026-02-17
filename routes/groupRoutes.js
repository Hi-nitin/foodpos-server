import express from "express";
import Group from "../models/Group.js";

const router = express.Router();


// groups by table
router.get("/table/:tableId", async (req, res) => {
  const groups = await Group.find({
    tableId: req.params.tableId,
    status: "active"
  });

  res.json(groups);
});


// create group
router.post("/", async (req, res) => {
  const group = await Group.create(req.body);
  res.json(group);
});


// complete group
router.put("/:id/complete", async (req, res) => {
  const group = await Group.findByIdAndUpdate(
    req.params.id,
    { status: "completed" },
    { new: true }
  );

  res.json(group);
});


// delete group
router.delete("/:id", async (req, res) => {
  await Group.findByIdAndDelete(req.params.id);
  res.json({ msg: "Group removed" });
});

export default router;
