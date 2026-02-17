import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true
    },

    // ✅ Fixed waiter groups
    groupName: {
      type: String,
      enum: ["G1", "G2", "G3", "G4"],
      required: true
    },

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true
        },
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        qty: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],

    status: {
      type: String,
      enum: ["draft", "sent", "completed"],
      default: "sent"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
