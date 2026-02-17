import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table"
    },
    name: String,
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Group", GroupSchema);
