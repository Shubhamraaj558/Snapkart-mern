import React from 'react';
import CANCELIMAGE from '../assest/cancel.gif';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaTimesCircle } from 'react-icons/fa';

const Cancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-6 sm:left-16 w-40 sm:w-72 h-40 sm:h-72 bg-red-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-6 sm:right-16 w-52 sm:w-80 h-52 sm:h-80 bg-orange-300/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-5 sm:p-7 md:p-8 text-center">
          
          {/* Image */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400/10 rounded-full blur-2xl scale-125"></div>
              <img
                src={CANCELIMAGE}
                alt="Payment cancelled"
                className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain mx-auto mix-blend-multiply"
              />
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <FaTimesCircle className="text-red-600 text-xl sm:text-2xl" />
            <h1 className="text-2xl sm:text-3xl font-black text-red-600">
              Payment Cancelled
            </h1>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
            Your payment was not completed. Don’t worry — your cart items are still safe.
            You can go back to the cart and try again anytime.
          </p>

          {/* Info box */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 mb-6 shadow-sm">
            <p className="text-sm sm:text-base font-semibold text-gray-700">
              No amount was charged successfully
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Please review your cart or continue shopping.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to="/cart"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-3.5 sm:py-4 px-5 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              <FaShoppingCart />
              Go To Cart
            </Link>

            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 font-semibold py-3.5 sm:py-4 px-5 rounded-2xl border border-red-200 bg-white/90 text-red-700 hover:bg-red-50 transition-all duration-300 text-sm sm:text-base"
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

export default Cancel;