const userModel = require("../../models/userModel");

const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID required",
        error: true,
        success: false
      });
    }

    await userModel.findByIdAndDelete(userId);

    res.json({
      message: "User Deleted Successfully",
      success: true,
      error: false
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || "Delete Failed",
      error: true,
      success: false
    });
  }
};

module.exports = deleteUserController;