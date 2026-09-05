const orderModel = require("../../models/orderProductModel");
const cartModel = require("../../models/cartProduct");

const cashOnDeliveryController = async (request, response) => {
    try {
        const currentUserId = request.userId;
        const { cartItems, shippingDetails, totalAmount, paymentMethod } = request.body;

        const newOrder = new orderModel({
            userId: currentUserId,
            productDetails: cartItems,
            shippingDetails: ['Cash on Delivery (COD)'],
            totalAmount: totalAmount,
            paymentDetails: {
                payment_method_type: ['Cash'],
                payment_status: 'Pending'
            },
            paymentMethod: paymentMethod,
        });

        const savedOrder = await newOrder.save();

        // FIX: Order successful hote hi user ka cart database se delete kar do taaki cart empty ho jaye
        await cartModel.deleteMany({ userId: currentUserId });

        return response.status(200).json({
            success: true,
            message: "Order placed successfully",
            data: savedOrder
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
};

module.exports = cashOnDeliveryController;