const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    productType: {
      type: String,
      required: true,
      enum: ["simple", "bundle", "configurable"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 1 });
module.exports = mongoose.model("Product", productSchema);
