const backendDomin = process.env.REACT_APP_BACKEND_URL || "https://snapkart-mern.onrender.com"

// const backendDomin = "http://localhost:8080"

const SummaryApi = {
    signUP: {
        url: `${backendDomin}/api/signup`,
        method: "post"
    },
    signIn: {
        url: `${backendDomin}/api/signin`,
        method: "post"
    },
    current_user: {
        url: `${backendDomin}/api/user-details`,
        method: "get"
    },
    logout_user: {
        url: `${backendDomin}/api/userLogout`,
        method: 'get'
    },
    allUser: {
        url: `${backendDomin}/api/all-user`,
        method: 'get'
    },
    updateUser: {
        url: `${backendDomin}/api/update-user`,
        method: "post"
    },
    deleteUser: {
        url: `${backendDomin}/api/delete-user`,
        method: "DELETE"
    },
    uploadProduct: {
        url: `${backendDomin}/api/upload-product`,
        method: 'post'
    },
    allProduct: {
        url: `${backendDomin}/api/get-product`,
        method: 'get'
    },
    updateProduct: {
        url: `${backendDomin}/api/update-product`,
        method: 'post'
    },
    deleteProduct: {
        url: `${backendDomin}/api/delete-product`,
        method: "DELETE"
    },
    categoryProduct: {
        url: `${backendDomin}/api/get-categoryProduct`,
        method: 'get'
    },
    categoryWiseProduct: {
        url: `${backendDomin}/api/category-product`,
        method: 'post'
    },
    productDetails: {
        url: `${backendDomin}/api/product-details`,
        method: 'post'
    },
    addToCartProduct: {
        url: `${backendDomin}/api/addtocart`,
        method: 'post'
    },
    addToCartProductCount: {
        url: `${backendDomin}/api/countAddToCartProduct`,
        method: 'get'
    },
    addToCartProductView: {
        url: `${backendDomin}/api/view-card-product`,
        method: 'get'
    },
    updateCartProduct: {
        url: `${backendDomin}/api/update-cart-product`,
        method: 'post'
    },
    deleteCartProduct: {
        url: `${backendDomin}/api/delete-cart-product`,
        method: 'post'
    },
    searchProduct: {
        url: `${backendDomin}/api/search`,
        method: 'get'
    },
    filterProduct: {
        url: `${backendDomin}/api/filter-product`,
        method: 'post'
    },
    payment: {
        url: `${backendDomin}/api/checkout`,
        method: 'post'
    },
    cashOnDelivery: {
    url: `${backendDomin}/api/cash-on-delivery`, // apne backend URL ke hisaab se
    method: 'POST'
    },
    getOrder: {
        url: `${backendDomin}/api/order-list`,
        method: 'get'
    },
    allOrder: {
        url: `${backendDomin}/api/all-order`,
        method: 'get'
    },
    addWishlist: {
        url: `${backendDomin}/api/add-wishlist`,
        method: "post"
    },

    getWishlist: {
        url: `${backendDomin}/api/get-wishlist`,
        method: "get"
    },

    deleteWishlist: {
        url: `${backendDomin}/api/delete-wishlist`,
        method: "DELETE"
    },
    updateProfilePic: {
        url: `${backendDomin}/api/update-profile-pic`,
        method: "post"
    }
}


export default SummaryApi