const wishlistModel = require("../../models/wishlistModel");
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    // check already exists
    const already = await wishlistModel.findOne({ userId, productId });

    if (already) {
      return res.json({
        success: false,
        message: "Already in wishlist"
      });
    }

    const newWishlist = new wishlistModel({
      userId,
      productId
    });

    await newWishlist.save();

    res.json({
      success: true,
      message: "Added to wishlist"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

module.exports = addToWishlist;