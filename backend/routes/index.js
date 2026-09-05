const express = require('express');
const router = express.Router();
const axios = require("axios");

// ================= Controllers =================
const userSignUpController = require("../controller/user/userSignUp");
const userSignInController = require('../controller/user/userSignIn');
const userDetailsController = require('../controller/user/userDetails');
const userLogout = require('../controller/user/userLogout');
const allUsers = require('../controller/user/allUsers');
const updateUser = require('../controller/user/updateUser');
const deleteUserController = require('../controller/user/deleteUser');
const UploadProductController = require('../controller/product/uploadProduct');
const getProductController = require('../controller/product/getProduct');
const updateProductController = require('../controller/product/updateProduct');
const getCategoryProduct = require('../controller/product/getCategoryProductOne');
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct');
const getProductDetails = require('../controller/product/getProductDetails');
const addToCartController = require('../controller/user/addToCartController');
const countAddToCartProduct = require('../controller/user/countAddToCartProduct');
const addToCartViewProduct = require('../controller/user/addToCartViewProduct');
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct');
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct');
const searchProduct = require('../controller/product/searchProduct');
const filterProductController = require('../controller/product/filterProduct');
const paymentController = require('../controller/order/paymentController');
const webhooks = require('../controller/order/webhook');
const orderController = require('../controller/order/order.controller');
const allOrderController = require('../controller/order/allOrder.controller');
const { deleteProductController } = require('../controller/product/productController');
const addToWishlist = require("../controller/product/addToWishlist");
const getWishlist = require("../controller/product/getWishlist");
const removeWishlist = require("../controller/product/removeWishlist");
const updateProfilePic = require("../controller/user/updateProfilePic");
const authToken = require('../middleware/authToken');
const cashOnDeliveryController = require('../controller/order/cashOnDeliveryController');


// ================= ROUTES =================

// AUTH
router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);

// ADMIN
router.get("/all-user", authToken, allUsers);
router.post("/update-user", authToken, updateUser);
router.delete("/delete-user/:id", deleteUserController);
router.post("/update-profile-pic", authToken, updateProfilePic);

// PRODUCT
router.post("/upload-product", authToken, UploadProductController);
router.get("/get-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.delete("/delete-product/:id", authToken, deleteProductController)
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getProductDetails);
router.get("/search", searchProduct);
router.post("/filter-product", filterProductController);
router.post("/add-wishlist", authToken, addToWishlist);
router.get("/get-wishlist", authToken, getWishlist);
router.delete("/delete-wishlist/:id", authToken, removeWishlist);

// CART
router.post("/addtocart", authToken, addToCartController);
router.get("/countAddToCartProduct", authToken, countAddToCartProduct);
router.get("/view-card-product", authToken, addToCartViewProduct);
router.post("/update-cart-product", authToken, updateAddToCartProduct);
router.post("/delete-cart-product", authToken, deleteAddToCartProduct);

// PAYMENT & ORDER
router.post('/checkout', authToken, paymentController);
router.post("/cash-on-delivery", authToken, cashOnDeliveryController); // Fixed middleware name here
router.post('/webhook', webhooks);
router.get("/order-list", authToken, orderController);
router.get("/all-order", authToken, allOrderController);


// ================= AI CHAT (HUGGINGFACE + SAFE) =================
router.post("/chat", async (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.status(400).json({
            reply: "Message is required"
        });
    }

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
            {
                inputs: message
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let reply = "No response";

        if (Array.isArray(response.data)) {
            reply = response.data[0]?.generated_text;
        } else if (response.data?.generated_text) {
            reply = response.data.generated_text;
        } else {
            reply = JSON.stringify(response.data);
        }

        res.json({ reply });

    } catch (error) {
        console.log("AI ERROR:", error.response?.data || error.message);

        res.status(500).json({
            reply: "AI_TEMPORARILY_UNAVAILABLE :) "
        });
    }
});

module.exports = router;