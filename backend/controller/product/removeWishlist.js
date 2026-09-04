const wishlistModel = require("../../models/wishlistModel");

const removeWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    await wishlistModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Removed from wishlist"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

module.exports = removeWishlist;