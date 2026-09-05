import React, { useEffect } from 'react';
import SUCCESSIMAGE from '../assest/success.gif';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import SummaryApi from '../common';

const Success = () => {

  // ✅ Stripe se redirect hone ke baad cart clear karne ki API call
  useEffect(() => {
    const clearCartAfterPayment = async () => {
      try {
        const response = await fetch(SummaryApi.deleteCartProduct?.url || '/api/delete-cart-product', { // Apne SummaryApi ke mutabiq route check kar lein
          method: SummaryApi.deleteCartProduct?.method || 'POST',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          console.log("Cart cleared successfully after payment.");
        }
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    };

    clearCartAfterPayment();
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-6 sm:left-16 w-40 sm:w-72 h-40 sm:h-72 bg-green-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-6 sm:right-16 w-52 sm:w-80 h-52 sm:h-80 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-44 sm:w-64 h-44 sm:h-64 -translate-x-1/2 -translate-y-1/2 bg-lime-200/20 rounded-full blur-3xl animate-ping" />
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg">
        <div className="bg-white/75 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-5 sm:p-7 md:p-8 text-center">

          {/* Success icon area */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl scale-125"></div>
              <img
                src={SUCCESSIMAGE}
                alt="Payment success"
                className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain mx-auto"
              />
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <FaCheckCircle className="text-green-600 text-xl sm:text-2xl" />
            <h1 className="text-2xl sm:text-3xl font-black text-green-600">
              Payment Successful
            </h1>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
            Your order has been placed successfully. You can track your order details
            or continue shopping for more amazing products.
          </p>

          {/* Info box */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 mb-6 shadow-sm">
            <p className="text-sm sm:text-base font-semibold text-gray-700">
              Thank you for shopping with us 💚
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Your transaction was completed securely.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to="/order"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 sm:py-4 px-5 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              <FaShoppingBag />
              See Order
            </Link>

            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 font-semibold py-3.5 sm:py-4 px-5 rounded-2xl border border-green-200 bg-white/90 text-green-700 hover:bg-green-50 transition-all duration-300 text-sm sm:text-base"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;