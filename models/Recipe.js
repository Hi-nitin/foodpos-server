import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    steps: [
      {
        desc: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
