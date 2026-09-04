const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

module.exports = wishlistModel;