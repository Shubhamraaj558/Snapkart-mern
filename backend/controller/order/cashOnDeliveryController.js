const orderModel = require('../../models/orderProductModel');
const cartModel = require('../../models/cartProduct');

const cashOnDeliveryController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const { cartItems, shippingDetails, totalAmount } = req.body;

        const orderData = {
            userId: currentUserId,
            productDetails: cartItems,
            shippingDetails: shippingDetails,
            totalAmount: totalAmount,
            paymentDetails: {
                paymentId: "COD-" + Date.now(),
                payment_method_type: "Cash on Delivery",
                payment_status: "Unpaid / Cash on Delivery"
            }
        };

        const newOrder = new orderModel(orderData);
        const savedOrder = await newOrder.save();

        // Clear cart after order is placed
        await cartModel.deleteMany({ userId: currentUserId });

        return res.json({
            success: true,
            error: false,
            message: "Order placed successfully with Cash on Delivery",
            data: savedOrder
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: true,
            message: err.message || err
        });
    }
};

module.exports = cashOnDeliveryController;