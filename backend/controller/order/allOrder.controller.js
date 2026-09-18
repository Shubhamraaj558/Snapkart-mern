const orderModel = require("../../models/orderProductModel")
const userModel = require("../../models/userModel")

const allOrderController = async (request, response) => {
    try {
        const userId = request.userId
        const user = await userModel.findById(userId)

        let orders;

        if (user && user.role === 'ADMIN') {
            orders = await orderModel.find()
                .populate("userId", "name email phone") // phone bhi manga lo agar user model me hai
                .sort({ createdAt: -1 })
        } else {
            orders = await orderModel.find()
                .populate("userId", "name email phone")
                .sort({ createdAt: -1 })
        }

        const formattedOrders = orders.map(order => {
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