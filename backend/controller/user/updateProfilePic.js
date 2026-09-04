const userModel = require("../../models/userModel");

const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.userId;

    await userModel.findByIdAndUpdate(userId, {
      profilePic
    });

    res.json({
      success: true,
      message: "Profile picture updated"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

module.exports = updateProfilePic;