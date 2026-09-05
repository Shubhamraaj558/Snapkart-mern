import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaCheckCircle, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

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
          {data.map((item, index) => (
            <div
              key={item.userId + index}
              className="bg-white rounded-2xl shadow-md border overflow-hidden"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-purple-700 to-pink-600 text-white px-4 py-3">
                <div>
                  <p className="text-sm sm:text-base font-bold">
                    {moment(item.createdAt).format('LL')}
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

              <div className="p-3 sm:p-4 lg:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 lg:gap-6">
                  <div className="space-y-3">
                    {item?.productDetails?.map((product, index) => (
                      <div
                        key={product.productId + index}
                        className="flex flex-col xs:flex-row sm:flex-row gap-3 bg-slate-50 border rounded-xl p-3"
                      >
                        <div className="w-full sm:w-24 h-32 sm:h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2">
                          <img
                            src={
                              Array.isArray(product.image)
                                ? product.image[0]
                                : product.image || product.productImage?.[0] || product.productImage || product.productId?.productImage?.[0] || product.productId?.productImage
                            }
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
                              {displayINRCurrency(product.price || product.productId?.sellingPrice || product.sellingPrice || 0)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {product.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
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
                        {item.paymentDetails?.payment_status || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2">
                        Shipping Details
                      </h3>

                      {item.shipping_options?.map((shipping, index) => (
                        <p
                          key={shipping.shipping_rate || index}
                          className="text-sm text-gray-700"
                        >
                          <span className="font-semibold">Shipping Amount:</span>{' '}
                          {displayINRCurrency(shipping.shipping_amount || 0)}
                        </p>
                      ))}
                    </div>

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
          ))}
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