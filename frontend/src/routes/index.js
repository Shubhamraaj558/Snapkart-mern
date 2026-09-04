import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassowrd from '../pages/ForgotPassowrd'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct'
import Aboutus from '../pages/Aboutus'
import Contactus from '../pages/Contactus'
import Success from '../pages/Success'
import Cancel from '../pages/Cancel'
import OrderPage from '../pages/OrderPage'
import AllOrder from '../pages/AllOrder'
import TermsAndConditions from '../pages/TermsAndConditions'
import ShippingAndReturns from '../pages/Shipping&Return'
import PrivacyPolicy from '../pages/Privacy&Policy'
import FAQ from '../pages/FaQs'
import Profile from '../pages/Profile'
import Wishlist from '../pages/Wishlist';



const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "Profile",
                element: <Profile />
            },
            {
                path: "forgot-password",
                element: <ForgotPassowrd />
            },
            {
                path: "sign-up",
                element: <SignUp />
            },
            {
                path: "product-category",
                element: <CategoryProduct />
            },
            {
                path: "product/:id",
                element: <ProductDetails />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'wishlist',
                element: <Wishlist />
            },
            {
                path: 'success',
                element: <Success />
            },
            {
                path: 'cancel',
                element: <Cancel />
            },
            {
                path: "search",
                element: <SearchProduct />
            },
            {
                path: 'order',
                element: <OrderPage />
            },
            {
                path: "admin-panel",
                element: <AdminPanel />,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />
                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    },
                    {
                        path: "all-orders",
                        element: <AllOrder />
                    }
                ]
            },
            {
                path: "about",
                element: <Aboutus />
            },
            {
                path: "home",
                element: <Home />
            },
            {
                path: "shop",
                element: <Home />
            },
            {
                path: "contact",
                element: <Contactus />
            },
            {
                path: "terms",
                element: <TermsAndConditions />
            },
            {
                path: "shipping-return",
                element: <ShippingAndReturns />
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicy/>
            },
            {
                path: "FaQs",
                element: <FAQ />
            }
        ]
    }
])


export default router