import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FaMoneyBillWave,
  FaQrcode,
  FaCopy,
  FaCheck,
  FaShieldAlt,
} from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [copied, setCopied] = useState(false);

  const context = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    phone: '',
  });

  const upiId = "snapKart@upi";

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleCheckout = async () => {
    const { name, address, pincode, phone } = formData;
    setSubmitted(true);
    if (!name || !address || !pincode || !phone) {
      setWarning('Please fill in all delivery details before checkout.');
      return;
    }
    setWarning('');

    if (paymentMethod === 'cod') {
      await handleCashOnDelivery();
    } else if (paymentMethod === 'online') {
      await handleStripePayment();
    } else if (paymentMethod === 'UPI') {
      await handleUpiPayment();
    }
  };

  const handleStripePayment = async () => {
    try {
      setPaymentLoading(true);
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      const response = await fetch(SummaryApi.payment.url, {
        method: SummaryApi.payment.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: data,
          shippingDetails: formData,
        }),
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

  const handleCashOnDelivery = async () => {
    try {
      setPaymentLoading(true);
      const response = await fetch(SummaryApi.cashOnDelivery?.url || '/api/cash-on-delivery', {
        method: SummaryApi.cashOnDelivery?.method || 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: data,
          shippingDetails: formData,
          totalAmount: totalPrice,
          paymentMethod: 'COD',
        }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success("Order placed successfully with Cash on Delivery!");
        context.fetchUserAddToCart();
        navigate('/success');
      } else {
        toast.error(responseData.message || 'Failed to place order. Try again.');
      }
    } catch (error) {
      console.error('COD Order failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleUpiPayment = async () => {
    try {
      setPaymentLoading(true);
      const response = await fetch(`${SummaryApi.cashOnDelivery.url}`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: data,
          shippingDetails: formData,
          totalAmount: totalPrice,
          paymentMethod: "Mock UPI"
        })
      });
      const resData = await response.json();
      if (resData.success) {
        toast.success("Payment Successful (Simulated)!");
        context.fetchUserAddToCart();
        navigate("/success");
      } else {
        toast.error(resData.message || "Something went wrong");
      }
    } catch (error) {
      console.error('UPI Payment failed:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const totalQty = data.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = data.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.productId?.sellingPrice || 0),
    0
  );

  const dummyTextString = `--- SIMULATED TEST PAYMENT ---\nStore: SnapKart Online-Shopping 🛒\nAmount: ${displayINRCurrency(totalPrice)}\nUPI ID: ${upiId}\nStatus: For Testing Only`;
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dummyTextString)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-4 px-3 sm:px-4 relative overflow-hidden text-sm">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-60 h-60 bg-pink-300/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-500 bg-clip-text text-transparent mb-1">
            Your Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Review your items and complete your order securely
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 border-4 border-dashed border-indigo-500/40 rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Securing Connection...</span>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-12 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 max-w-xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">Looks like you haven't added anything yet.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-xl shadow hover:scale-105 transition-all text-xs sm:text-sm"
            >
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>
        )}

        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
            {/* Left Side: Cart Products List */}
            <div className="xl:col-span-2 space-y-3">
              {data.map((product) => {
                const safeProduct = product.productId || {};
                const itemTotal = (safeProduct.sellingPrice || 0) * (product.quantity || 1);

                return (
                  <div
                    key={product._id}
                    className="group relative bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-2 shadow-sm shrink-0 overflow-hidden">
                        <img
                          src={safeProduct.productImage?.[0]}
                          alt={safeProduct.productName || 'Product'}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                          {safeProduct.productName || 'Unknown Product'}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-purple-600 font-semibold capitalize mb-2 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                          {safeProduct.category || 'Uncategorized'}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-xs text-gray-500 line-through mr-2">
                              {safeProduct.price ? displayINRCurrency(safeProduct.price) : ''}
                            </span>
                            <span className="text-sm font-black text-gray-900">
                              {displayINRCurrency(safeProduct.sellingPrice || 0)}
                            </span>
                            <span className="text-xs font-bold text-purple-600 ml-2">
                              (Total: {displayINRCurrency(itemTotal)})
                            </span>
                          </div>

                          <div className="flex items-center bg-white/90 rounded-xl p-1 shadow-sm border border-purple-100">
                            <button
                              aria-label="Decrease quantity"
                              disabled={product.quantity <= 1}
                              onClick={() => decreaseQty(product._id, product.quantity)}
                              className={`w-7 h-7 flex items-center justify-center font-bold rounded-lg ${
                                product.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-purple-50'
                              }`}
                            >
                              <MdRemove className="text-xs" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-900">
                              {product.quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => increaseQty(product._id, product.quantity)}
                              className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-purple-50 rounded-lg"
                            >
                              <MdAdd className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        title="Remove from cart"
                        onClick={() => deleteCartProduct(product._id)}
                        className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-lg shadow-sm border border-gray-100 hover:bg-red-50 flex items-center justify-center transition-all"
                      >
                        <MdDelete className="text-xs text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Delivery Details & Payment Selection & Summary */}
            <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
              {/* Delivery Details Card */}
              <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-md">
                <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white py-2.5 px-3.5 rounded-xl mb-3 shadow">
                  <h3 className="text-xs sm:text-sm font-black flex items-center gap-2">
                    <FaTruck className="text-yellow-400" /> Delivery Details
                  </h3>
                </div>

                <form className="space-y-2.5" onSubmit={(e) => e.preventDefault()}>
                  {warning && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                      {warning}
                    </div>
                  )}

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none bg-white/70 ${
                      submitted && !formData.name ? 'border-red-400' : 'border-gray-200 focus:border-purple-400'
                    }`}
                    required
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Address (House no, street, locality)"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none bg-white/70 ${
                      submitted && !formData.address ? 'border-red-400' : 'border-gray-200 focus:border-purple-400'
                    }`}
                    required
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-xl border text-xs outline-none bg-white/70 ${
                        submitted && !formData.pincode ? 'border-red-400' : 'border-gray-200 focus:border-purple-400'
                      }`}
                      required
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-xl border text-xs outline-none bg-white/70 ${
                        submitted && !formData.phone ? 'border-red-400' : 'border-gray-200 focus:border-purple-400'
                      }`}
                      required
                    />
                  </div>
                </form>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white/75 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-md">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 px-3.5 rounded-xl mb-3 shadow">
                  <h3 className="text-xs sm:text-sm font-black flex items-center gap-2">
                    <FaCreditCard className="text-yellow-400" /> Payment Method
                  </h3>
                </div>

                <div className="space-y-2 mb-3">
                  <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${paymentMethod === 'online' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-purple-600" />
                      <span className="font-semibold text-gray-800">Pay Online (Stripe)</span>
                    </div>
                    <FaCreditCard className="text-purple-600" />
                  </label>

                  <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${paymentMethod === 'cod' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-purple-600" />
                      <span className="font-semibold text-gray-800">Cash on Delivery (COD)</span>
                    </div>
                    <FaMoneyBillWave className="text-emerald-600" />
                  </label>

                  <label className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${paymentMethod === 'UPI' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-purple-600" />
                      <span className="font-semibold text-gray-800">Dynamic UPI QR (Testing)</span>
                    </div>
                    <FaQrcode className="text-cyan-600" />
                  </label>
                </div>

                {/* Dynamic UPI QR Section */}
                {paymentMethod === 'UPI' && (
                  <div className="mb-3 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-3.5 rounded-xl text-white">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                          <FaQrcode className="text-white text-xs" />
                        </div>
                        <h4 className="font-bold text-xs text-white">Scan UPI QR</h4>
                      </div>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">Sandbox</span>
                    </div>

                    <div className="mt-2.5 flex flex-col items-center justify-center bg-white p-2 rounded-lg">
                      <img src={dynamicQrUrl} alt="Dynamic UPI QR Code" className="w-28 h-28 object-contain" />
                      <span className="mt-1 text-[10px] font-bold text-purple-700 uppercase">
                        Amount: {displayINRCurrency(totalPrice)}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center justify-between bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs">
                        <span className="font-mono text-cyan-300">{upiId}</span>
                        <button onClick={handleCopyUpi} className="flex items-center gap-1 text-[10px] bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded">
                          {copied ? <FaCheck className="text-green-400" /> : <FaCopy />} {copied ? "Copied" : "Copy"}
                        </button>
                      </div>

                      <button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-2 px-2 rounded-lg shadow text-xs flex items-center justify-center gap-1.5"
                      >
                        <FaCheckCircle /> Simulate Payment Complete
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 mb-3 border-t pt-2.5 text-xs">
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>Total Items</span>
                    <span className="font-bold">{totalQty}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-black text-gray-900">
                    <span>Total Price</span>
                    <span>{displayINRCurrency(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleCheckout}
                    className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-xl shadow text-xs sm:text-sm text-white transition-all ${
                      paymentLoading ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:scale-[1.01]'
                    }`}
                  >
                    {paymentLoading ? (
                      <>
                        <FaSpinner className="animate-spin text-sm" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-sm" />
                        {paymentMethod === 'cod' ? 'Place COD Order' : paymentMethod === 'UPI' ? 'Proceed with UPI' : 'Proceed to Checkout'}
                      </>
                    )}
                  </button>

                  <Link
                    to="/cancel"
                    className="w-full flex items-center justify-center gap-1.5 font-semibold py-2 px-4 rounded-xl border border-purple-200 bg-white/80 text-purple-700 hover:bg-purple-50 transition-all text-xs"
                  >
                    <FaArrowLeft /> Cancel Payment
                  </Link>
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