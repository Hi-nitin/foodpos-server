import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    items: [
      {
        name: String,
        qty: Number,
        price: Number,
      },
    ],

    // ✅ Updated fields
    total: {
      type: Number,
      required: true,
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    finalTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
