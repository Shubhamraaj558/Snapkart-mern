import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete, MdRemove, MdAdd } from 'react-icons/md';
import {
  FaTruck,
  FaCreditCard,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
} from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const context = useContext(Context);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    phone: '',
  });

  const loadingSkeleton = Array(3).fill(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (warning) {
      setWarning('');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const responseData = await response.json();

      if (responseData.success) {
        setData(responseData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const increaseQty = async (id, qty) => {
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, quantity: qty + 1 }),
      });

      const resData = await response.json();
      if (resData.success) fetchData();
    } catch (error) {
      console.error('Failed to increase quantity:', error);
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty <= 1) return;

    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, quantity: qty - 1 }),
      });

      const resData = await response.json();
      if (resData.success) fetchData();
    } catch (error) {
      console.error('Failed to decrease quantity:', error);
    }
  };

  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });

      const resData = await response.json();
      if (resData.success) {
        fetchData();
        context.fetchUserAddToCart();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handlePayment = async () => {
    const { name, address, pincode, phone } = formData;

    setSubmitted(true);

    if (!name || !address || !pincode || !phone) {
      setWarning('Please fill in all delivery details before checkout.');
      alert('Please fill in all delivery details before checkout.');
      return;
    }

    setWarning('');

    try {
      setPaymentLoading(true);
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      // const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

      const response = await fetch(SummaryApi.payment.url, {
        method: SummaryApi.payment.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: data }),
      });

      const paymentData = await response.json();

      if (paymentData?.id) {
        await stripe.redirectToCheckout({ sessionId: paymentData.id });
      } else {
        alert('Error initiating payment. Please try again later.');
      }
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const totalQty = data.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = data.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.productId?.sellingPrice || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 sm:py-8 lg:py-10 px-3 sm:px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-4 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-4 sm:right-10 w-52 sm:w-96 h-52 sm:h-96 bg-gradient-to-l from-indigo-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent mb-2 sm:mb-3">
            Your Cart
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium max-w-2xl mx-auto px-2">
            Review your items and complete your order securely
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
            {loadingSkeleton.map((_, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/50 animate-pulse"
              >
                <div className="flex gap-4 sm:gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded-xl w-3/4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded-xl ml-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 max-w-2xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-5 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        )}

        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            <div className="xl:col-span-2 space-y-4 sm:space-y-5">
              {data.map((product) => {
                const safeProduct = product.productId || {};
                const itemTotal = (safeProduct.sellingPrice || 0) * (product.quantity || 1);

                return (
                  <div
                    key={product._id}
                    className="group relative bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                      <div className="w-full sm:w-auto flex justify-center sm:block">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-3 shadow-md overflow-hidden">
                          <img
                            src={safeProduct.productImage?.[0]}
                            alt={safeProduct.productName || 'Product'}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 mb-2">
                          {safeProduct.productName || 'Unknown Product'}
                        </h3>

                        <p className="text-xs sm:text-sm text-purple-600 font-semibold capitalize mb-3 bg-purple-50/70 px-3 py-1 rounded-full inline-block">
                          {safeProduct.category || 'Uncategorized'}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                          <div>
                            <p className="text-lg sm:text-xl font-black text-gray-900">
                              {displayINRCurrency(safeProduct.sellingPrice || 0)}
                            </p>
                            <p className="text-sm sm:text-base font-bold text-purple-600">
                              {displayINRCurrency(itemTotal)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-start bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-md border border-purple-100 w-full sm:w-auto">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => decreaseQty(product._id, product.quantity)}
                              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                            >
                              <MdRemove />
                            </button>

                            <span className="min-w-[2.5rem] text-center text-base sm:text-lg font-bold text-gray-900 px-2 sm:px-3">
                              {product.quantity}
                            </span>

                            <button
                              aria-label="Increase quantity"
                              onClick={() => increaseQty(product._id, product.quantity)}
                              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                            >
                              <MdAdd />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        title="Remove from cart"
                        onClick={() => deleteCartProduct(product._id)}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md border border-white/60 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-all duration-300"
                      >
                        <MdDelete className="text-lg sm:text-xl text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-5 sm:space-y-6 xl:sticky xl:top-24 xl:self-start">
              <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xl">
                <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white p-4 sm:p-5 rounded-2xl mb-5 sm:mb-6 shadow-lg">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-3">
                    <FaTruck className="text-yellow-400" />
                    Delivery Details
                  </h3>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  {warning && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm sm:text-base font-medium text-red-600">
                      {warning}
                    </div>
                  )}

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl sm:rounded-2xl border shadow-sm outline-none bg-white/70 text-sm sm:text-base ${submitted && !formData.name
                      ? 'border-red-400 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100/50'
                      }`}
                    required
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="House no, street, locality"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl sm:rounded-2xl border shadow-sm outline-none bg-white/70 text-sm sm:text-base ${submitted && !formData.address
                      ? 'border-red-400 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100/50'
                      }`}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl sm:rounded-2xl border shadow-sm outline-none bg-white/70 text-sm sm:text-base ${submitted && !formData.pincode
                        ? 'border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100/50'
                        }`}
                      required
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl sm:rounded-2xl border shadow-sm outline-none bg-white/70 text-sm sm:text-base ${submitted && !formData.phone
                        ? 'border-red-400 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100/50'
                        }`}
                      required
                    />
                  </div>
                </form>
              </div>

              <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xl">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sm:p-5 rounded-2xl mb-5 sm:mb-6 shadow-lg">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-3">
                    <FaCreditCard className="text-yellow-400" />
                    Order Summary
                  </h3>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm sm:text-base font-semibold text-gray-700">
                    <span>Total Items</span>
                    <span className="font-black text-lg sm:text-xl">{totalQty}</span>
                  </div>

                  <div className="flex justify-between text-lg sm:text-xl font-black text-gray-900">
                    <span>Total Price</span>
                    <span>{displayINRCurrency(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePayment}
                    className={`w-full flex items-center justify-center gap-3 font-bold py-3.5 sm:py-4 px-5 rounded-xl sm:rounded-2xl shadow-lg text-sm sm:text-base transition-all duration-300 ${paymentLoading
                      ? 'bg-gray-400 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:scale-[1.02]'
                      } text-white`}
                  >
                    {paymentLoading ? (
                      <>
                        <FaSpinner className="animate-spin text-lg sm:text-xl" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-lg sm:text-xl" />
                        Proceed to Checkout
                      </>
                    )}
                  </button>

                  <Link
                    to="/"
                    className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 sm:py-4 px-5 rounded-xl sm:rounded-2xl border border-purple-200 bg-white/80 text-purple-700 hover:bg-purple-50 transition-all duration-300 text-sm sm:text-base"
                  >
                    <FaArrowLeft />
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200 text-[11px] sm:text-xs text-gray-500 text-center space-y-1">
                  <p>Secure Checkout | SSL Protected | Fast Delivery</p>
                  <p>Powered by Stripe</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;