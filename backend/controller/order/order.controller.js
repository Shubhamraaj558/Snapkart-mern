const orderModel = require("../../models/orderProductModel")

const orderController = async (request, response) => {
    try {
        const currentUserId = request.userId

        const orderList = await orderModel.find({ userId: currentUserId })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })

        return response.status(200).json({
            data: orderList,
            message: "Order list fetched successfully",
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = orderController