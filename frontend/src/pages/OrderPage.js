import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBoxOpen, 
  FaCheckCircle, 
  FaShoppingBag, 
  FaArrowLeft, 
  FaTruck, 
  FaMapMarkerAlt,
  FaBox,
  FaShippingFast,
  FaHome,
  FaFileInvoice,
  FaPrint
} from 'react-icons/fa';

const OrderPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

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

  const calculateDeliveryProgress = (createdAt) => {
    const orderDate = moment(createdAt);
    const deliveryDate = moment(createdAt).add(5, 'days');
    const today = moment();

    if (today.isBefore(orderDate)) return 10;
    if (today.isAfter(deliveryDate)) return 100;

    const totalDuration = deliveryDate.diff(orderDate, 'hours');
    const elapsedDuration = today.diff(orderDate, 'hours');
    
    const progress = Math.round((elapsedDuration / totalDuration) * 100);
    return Math.max(15, Math.min(progress, 100));
  };

  // Function to handle printing/generating the invoice popup window
  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const address = order.shipping_address || {};
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Snapkart Invoice #${order._id?.slice(-8)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; margin-bottom: 20px; }
            .details { margin-bottom: 20px; font-size: 14px; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
            th { background-color: #f8f9fa; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; color: #7c3aed; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="color: #7c3aed; margin: 0;">SNAPKART RETAIL</h2>
            <p style="font-size: 12px; color: #666; margin: 4px 0;">Smart Shopping Platform - Tax Invoice</p>
            <p><strong>Order ID:</strong> #${order._id}</p>
            <p><strong>Date:</strong> ${moment(order.createdAt).format('LLL')}</p>
          </div>
          <div class="details">
            <strong>Customer Name:</strong> ${address.name || 'N/A'}<br/>
            <strong>Shipping Address:</strong> ${address.address || 'N/A'}, Pincode: ${address.pincode || 'N/A'}<br/>
            <strong>Phone:</strong> ${address.phone || 'N/A'}<br/>
            <strong>Payment Method:</strong> ${order.paymentDetails?.payment_method_type?.[0] || 'N/A'}<br/>
            <strong>Payment Status:</strong> ${order.paymentDetails?.payment_status || 'N/A'}
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${(order.productDetails || []).map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.quantity}</td>
                  <td>₹${p.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Total Amount: ₹${order.totalAmount || 0}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Track your orders, view invoices and payment details
          </p>
        </div>

        {!data[0] && (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-xl bg-purple-100 flex items-center justify-center mb-3">
              <FaBoxOpen className="text-xl text-purple-600" />
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-1">
              No Order Available
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              You have not placed any order yet.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-purple-700 transition text-xs sm:text-sm"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {data.map((item, index) => {
            const progressPercent = calculateDeliveryProgress(item.createdAt);

            return (
              <div
                key={item._id || item.userId + index}
                className="bg-white rounded-xl shadow-md border overflow-hidden text-xs sm:text-sm"
              >
                {/* Header Section */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-purple-700 to-pink-600 text-white px-3.5 py-2.5">
                  <div>
                    <p className="text-xs sm:text-sm font-bold">
                      {moment(item.createdAt).format('LLL')}
                    </p>
                    <p className="text-[11px] text-purple-100">
                      Order ID: <span className="font-mono">{item._id}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium w-fit">
                      <FaCheckCircle className="text-green-300 text-[10px]" />
                      <span>Confirmed</span>
                    </div>

                    {/* Print Invoice Button */}
                    <button
                      onClick={() => handlePrintInvoice(item)}
                      className="inline-flex items-center gap-1.5 bg-white text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow transition"
                      title="Print / Download Invoice"
                    >
                      <FaFileInvoice className="text-purple-600 text-xs" />
                      <span>Invoice / Print</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="bg-slate-50 border-b p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaTruck className="text-purple-600 text-xs" /> Estimated Delivery
                    </span>
                    <span className="text-xs font-bold text-purple-700">
                      {moment(item.createdAt).add(5, 'days').format('LL')}
                    </span>
                  </div>

                  <div className="relative w-full bg-gray-200 h-2 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-4 text-center mt-2 text-[11px] sm:text-xs">
                    <div className="flex flex-col items-center text-purple-700 font-semibold">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mb-0.5">
                        <FaBox className="text-purple-600 text-[10px]" />
                      </div>
                      <span>Order Placed</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 35 ? 'text-purple-700 font-semibold' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-0.5 ${progressPercent >= 35 ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <FaBoxOpen className={`text-[10px] ${progressPercent >= 35 ? 'text-purple-600' : 'text-gray-400'}`} />
                      </div>
                      <span>Packed</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 70 ? 'text-purple-700 font-semibold' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-0.5 ${progressPercent >= 70 ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <FaShippingFast className={`text-[10px] ${progressPercent >= 70 ? 'text-purple-600' : 'text-gray-400'}`} />
                      </div>
                      <span>Shipped</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 100 ? 'text-emerald-700 font-semibold' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-0.5 ${progressPercent >= 100 ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <FaHome className={`text-[10px] ${progressPercent >= 100 ? 'text-emerald-600' : 'text-gray-400'}`} />
                      </div>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-3">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3.5">
                    {/* Products List */}
                    <div className="space-y-2.5">
                      {item?.productDetails?.map((product, pIndex) => (
                        <div
                          key={product.productId + pIndex}
                          className="flex gap-2.5 bg-slate-50 border rounded-xl p-2.5"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                            <img
                              src={product.image?.[0]}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-2">
                              {product.name}
                            </h3>

                            <div className="mt-1.5 flex items-center gap-3">
                              <p className="text-xs sm:text-sm font-bold text-red-500">
                                {displayINRCurrency(product.price)}
                              </p>
                              <p className="text-xs text-gray-600">
                                Quantity: {product.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Details Side Panel */}
                    <div className="space-y-2.5">
                      {/* Payment Details */}
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                          Payment Details
                        </h3>
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">Method:</span>{' '}
                          {item.paymentDetails?.payment_method_type?.[0] || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-700 mt-0.5">
                          <span className="font-semibold">Status:</span>{' '}
                          <span className="capitalize font-medium text-green-600">
                            {item.paymentDetails?.payment_status || 'N/A'}
                          </span>
                        </p>
                      </div>

                      {/* Shipping Details */}
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FaTruck className="text-emerald-700 text-xs" />
                          <h3 className="text-xs sm:text-sm font-bold text-gray-800">
                            Shipping Details
                          </h3>
                        </div>

                        <p className="text-xs text-gray-700">
                          <span className="font-semibold">Est. Delivery:</span>{' '}
                          {moment(item.createdAt).add(5, 'days').format('LL')}
                        </p>

                        {item.shipping_options?.map((shipping, sIndex) => (
                          <p
                            key={shipping.shipping_rate || sIndex}
                            className="text-xs text-gray-700"
                          >
                            <span className="font-semibold">Shipping Amount:</span>{' '}
                            {displayINRCurrency(shipping.shipping_amount || 0)}
                          </p>
                        ))}

                        {item.shipping_address && (
                          <div className="pt-1.5 border-t border-emerald-200 mt-1.5">
                            <div className="flex items-start gap-1.5 text-xs text-gray-700">
                              <FaMapMarkerAlt className="text-emerald-600 mt-0.5 flex-shrink-0 text-xs" />
                              <div className="w-full">
                                <p className="font-semibold text-slate-700 mb-0.5">Delivery Address:</p>
                                <div className="text-slate-600 text-[11px] sm:text-xs space-y-0.5">
                                  <p className="font-bold text-slate-800">
                                    {item.shipping_address.name || 'N/A'}
                                  </p>
                                  <p>
                                    <span className="font-medium text-slate-700">Address:</span> {item.shipping_address.address || 'N/A'}
                                  </p>
                                  <p>
                                    <span className="font-medium text-slate-700">Pincode:</span> {item.shipping_address.pincode || 'N/A'}
                                  </p>
                                  {item.shipping_address.phone && (
                                    <p>
                                      <span className="font-medium text-slate-700">Phone:</span> {item.shipping_address.phone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Total Amount */}
                      <div className="bg-slate-50 border rounded-xl p-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs sm:text-sm font-bold text-gray-800">
                            Total Amount
                          </span>
                          <span className="text-sm sm:text-base font-black text-purple-700">
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
          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-700 font-semibold py-2.5 px-5 rounded-xl hover:bg-purple-50 transition shadow-sm text-xs sm:text-sm"
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