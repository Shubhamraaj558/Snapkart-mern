const orderModel = require("../../models/orderProductModel");

const cashOnDeliveryController = async (request, response) => {
    try {
        const currentUserId = request.userId;
        const { cartItems, shippingDetails, totalAmount, paymentMethod } = request.body;

        const newOrder = new orderModel({
            userId: currentUserId,
            productDetails: cartItems,
            shippingDetails: shippingDetails,
            totalAmount: totalAmount, // <--- Yeh line ensure kar ki yahan totalAmount save ho raha hai
            paymentDetails: {
                payment_method_type: ['cash'],
                payment_status: 'completed'
            },
            paymentMethod: paymentMethod,
        });

        const savedOrder = await newOrder.save();

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