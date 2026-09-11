import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import { 
  FaBoxOpen, 
  FaCheckCircle, 
  FaShoppingBag, 
  FaArrowLeft, 
  FaTruck, 
  FaMapMarkerAlt,
  FaBox,
  FaShippingFast,
  FaHome
} from 'react-icons/fa';

const OrderPage = () => {
  const [data, setData] = useState([]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.getOrder.url, {
        method: SummaryApi.getOrder.method,
        credentials: 'include',
      });

      const responseData = await response.json();
      setData(responseData.data || []);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  // Delivery Progress Calculate karne ka function
  const calculateDeliveryProgress = (createdAt) => {
    const orderDate = moment(createdAt);
    const deliveryDate = moment(createdAt).add(5, 'days');
    const today = moment();

    if (today.isBefore(orderDate)) return 10;
    if (today.isAfter(deliveryDate)) return 100;

    const totalDuration = deliveryDate.diff(orderDate, 'hours');
    const elapsedDuration = today.diff(orderDate, 'hours');
    
    const progress = Math.round((elapsedDuration / totalDuration) * 100);
    return Math.max(15, Math.min(progress, 100)); // Minimum 15% clear look ke liye
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 px-3 py-5 sm:px-4 sm:py-8 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Track your orders and payment details
          </p>
        </div>

        {!data[0] && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
              <FaBoxOpen className="text-2xl sm:text-3xl text-purple-600" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              No Order Available
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mb-5">
              You have not placed any order yet.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold py-3 px-5 rounded-xl hover:bg-purple-700 transition"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        )}

        <div className="space-y-5 sm:space-y-6">
          {data.map((item, index) => {
            const progressPercent = calculateDeliveryProgress(item.createdAt);

            return (
              <div
                key={item._id || item.userId + index}
                className="bg-white rounded-2xl shadow-md border overflow-hidden"
              >
                {/* Header Section */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-purple-700 to-pink-600 text-white px-4 py-3">
                  <div>
                    <p className="text-sm sm:text-base font-bold">
                      {moment(item.createdAt).format('LLL')}
                    </p>
                    <p className="text-xs sm:text-sm text-purple-100">
                      Order placed successfully
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium w-fit">
                    <FaCheckCircle className="text-green-300" />
                    Confirmed
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="bg-slate-50 border-b p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FaTruck className="text-purple-600" /> Estimated Delivery
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-purple-700">
                      {moment(item.createdAt).add(5, 'days').format('LL')}
                    </span>
                  </div>

                  {/* Visual Progress Bar Line */}
                  <div className="relative w-full bg-gray-200 h-2.5 rounded-full overflow-hidden my-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  {/* Step Icons & Labels */}
                  <div className="grid grid-cols-4 text-center mt-3 text-xs sm:text-sm">
                    <div className="flex flex-col items-center text-purple-700 font-semibold">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                        <FaBox className="text-purple-600 text-xs sm:text-sm" />
                      </div>
                      <span>Order Placed</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 35 ? 'text-purple-700 font-semibold' : 'text-gray-400'}`}>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 ${progressPercent >= 35 ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <FaBoxOpen className={progressPercent >= 35 ? 'text-purple-600' : 'text-gray-400'} />
                      </div>
                      <span>Packed</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 70 ? 'text-purple-700 font-semibold' : 'text-gray-400'}`}>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 ${progressPercent >= 70 ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <FaShippingFast className={progressPercent >= 70 ? 'text-purple-600' : 'text-gray-400'} />
                      </div>
                      <span>Shipped</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 100 ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 ${progressPercent >= 100 ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <FaHome className={progressPercent >= 100 ? 'text-emerald-600' : 'text-gray-400'} />
                      </div>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-3 sm:p-4 lg:p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 lg:gap-6">
                    {/* Products List */}
                    <div className="space-y-3">
                      {item?.productDetails?.map((product, pIndex) => (
                        <div
                          key={product.productId + pIndex}
                          className="flex flex-col xs:flex-row sm:flex-row gap-3 bg-slate-50 border rounded-xl p-3"
                        >
                          <div className="w-full sm:w-24 h-32 sm:h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2">
                            <img
                              src={product.image?.[0]}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2">
                              {product.name}
                            </h3>

                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                              <p className="text-base font-bold text-red-500">
                                {displayINRCurrency(product.price)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {product.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Details Side Panel */}
                    <div className="space-y-3">
                      {/* Payment Details */}
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2">
                          Payment Details
                        </h3>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Method:</span>{' '}
                          {item.paymentDetails?.payment_method_type?.[0] || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-semibold">Status:</span>{' '}
                          <span className="capitalize font-medium text-green-600">
                            {item.paymentDetails?.payment_status || 'N/A'}
                          </span>
                        </p>
                      </div>

                      {/* Shipping Details */}
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 sm:p-4 space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <FaTruck className="text-emerald-700 text-base" />
                          <h3 className="text-sm sm:text-base font-bold text-gray-800">
                            Shipping Details
                          </h3>
                        </div>

                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Est. Delivery:</span>{' '}
                          {moment(item.createdAt).add(5, 'days').format('LL')}
                        </p>

                        {item.shipping_options?.map((shipping, sIndex) => (
                          <p
                            key={shipping.shipping_rate || sIndex}
                            className="text-sm text-gray-700"
                          >
                            <span className="font-semibold">Shipping Amount:</span>{' '}
                            {displayINRCurrency(shipping.shipping_amount || 0)}
                          </p>
                        ))}

                        {item.shipping_address && (
                          <div className="pt-2 border-t border-emerald-200 mt-2">
                            <div className="flex items-start gap-1.5 text-sm text-gray-700">
                              <FaMapMarkerAlt className="text-emerald-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-semibold">Delivery Address:</p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {item.shipping_address.line1 || item.shipping_address.street},{' '}
                                  {item.shipping_address.city}, {item.shipping_address.state} -{' '}
                                  {item.shipping_address.postal_code}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Total Amount */}
                      <div className="bg-slate-50 border rounded-xl p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm sm:text-base font-bold text-gray-800">
                            Total Amount
                          </span>
                          <span className="text-base sm:text-xl font-black text-purple-700">
                            {displayINRCurrency(item.totalAmount || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data[0] && (
          <div className="mt-6 sm:mt-8">
            <Link
              to="/"
              className="w-full sm:w-fit mx-auto flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-700 font-semibold py-3 px-5 rounded-xl hover:bg-purple-50 transition shadow-sm"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;