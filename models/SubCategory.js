import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate subcategory for same category
subCategorySchema.index(
  { name: 1, category: 1 },
  { unique: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
