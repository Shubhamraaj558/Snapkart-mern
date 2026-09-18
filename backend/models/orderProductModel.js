const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    productDetails: {
        type: Array,
        default: []
    },
    email: {
        type: String,
        default: ""
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    paymentDetails: {
        paymentId: {
            type: String,
            default: ""
        },
        payment_method_type: [],
        payment_status: {
            type: String,
            default: ""
        }
    },
    shipping_options: [],
    shipping_address: {
        type: Object,
        default: {}
    },
    paymentMethod: {
        type: String,
        default: "COD"
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String,
        default: "CONFIRMED"
    }
}, {
    timestamps: true
})

const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel