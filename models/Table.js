import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,   // 🔥 No two tables same
      trim: true
    },
    reserved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Table", tableSchema);
