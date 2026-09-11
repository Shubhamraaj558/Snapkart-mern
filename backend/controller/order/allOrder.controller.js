const orderModel = require("../../models/orderProductModel")
const userModel = require("../../models/userModel")

const allOrderController = async (request, response) => {
    try {
        const userId = request.userId
        const user = await userModel.findById(userId)

        if (user.role !== 'ADMIN') {
            return response.status(403).json({
                message: "Not authorized",
                success: false
            })
        }

        const AllOrder = await orderModel.find().sort({ createdAt: -1 })

        const formattedOrders = AllOrder.map(order => {
            const orderObj = order.toObject();
            if (!orderObj.orderStatus) {
                orderObj.orderStatus = "CONFIRMED";
            }
            return orderObj;
        });

        return response.status(200).json({
            data: formattedOrders,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = allOrderController