const productModel = require("../../models/productModel");

const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    await productModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { deleteProductController };