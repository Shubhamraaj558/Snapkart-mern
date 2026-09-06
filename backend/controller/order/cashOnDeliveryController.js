const orderModel = require("../../models/orderProductModel")
const cartModel = require("../../models/cartProduct")

const cashOnDeliveryController = async (request, response) => {
    try {
        const currentUserId = request.userId
        const { cartItems, shippingDetails, totalAmount, paymentMethod } = request.body;

        // Map cart items to explicitly grab image, name, and price from various possible fields
        const formattedProductDetails = cartItems.map((item) => ({
            productId: item.productId?._id || item.productId,
            name: item.productId?.productName || item.name,
            image: item.image || item.productImage || item.productId?.productImage || [],
            price: item.productId?.sellingPrice || item.price,
            quantity: item.quantity
        }));

        // Dynamic check for UPI vs COD
        const isUpi = paymentMethod && (paymentMethod.toUpperCase() === "UPI" || paymentMethod.toUpperCase().includes("UPI"));

        const newOrder = new orderModel({
            userId: currentUserId,
            productDetails: formattedProductDetails,
            shippingDetails: shippingDetails,
            totalAmount: totalAmount,
            paymentDetails: {
                paymentId: (isUpi ? "UPI_" : "COD_") + Date.now(),
                payment_method_type: [isUpi ? "UPI QR" : "Cash on Delivery (COD)"],
                payment_status: isUpi ? "Paid via UPI" : "Pending"
            },
            paymentMethod: paymentMethod || "COD",
        });

        const savedOrder = await newOrder.save();

        // Clear user's cart after successful order placement
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