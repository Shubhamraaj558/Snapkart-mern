const wishlistModel = require("../../models/wishlistModel");

const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    const data = await wishlistModel
      .find({ userId })
      .populate("productId");

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

module.exports = getWishlist;