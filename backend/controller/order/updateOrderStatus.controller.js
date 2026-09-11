const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");

const updateOrderStatusController = async (request, response) => {
    try {
        const currentUserId = request.userId;
        const { orderId, orderStatus } = request.body;

        // Check karein ki user ADMIN hai ya nahi
        const user = await userModel.findById(currentUserId);
        if (user.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Not authorized",
                success: false
            });
        }

        // Order status update karein
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { orderStatus: orderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return response.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        response.json({
            message: "Order status updated successfully",
            data: updatedOrder,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
};

module.exports = updateOrderStatusController;