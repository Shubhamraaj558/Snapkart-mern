import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';
import {
  FaBoxOpen,
  FaCheckCircle,
  FaTruck,
  FaMapMarkerAlt,
  FaBox,
  FaShippingFast,
  FaHome,
  FaUser,
  FaSearch,
  FaEdit,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Update status modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.allOrder?.url || SummaryApi.getOrder.url, {
        method: SummaryApi.allOrder?.method || SummaryApi.getOrder.method,
        credentials: 'include',
      });

      const responseData = await response.json();
      const orders = responseData.data || [];
      setAllOrders(orders);
      setFilteredOrders(orders);
    } catch (error) {
      console.error('Failed to fetch all orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Fixed Filter and Search Logic
  useEffect(() => {
    let result = [...allOrders];

    // Status Filter Logic
    if (statusFilter !== 'ALL') {
      result = result.filter(order => {
        const status = (order?.orderStatus || 'CONFIRMED').toUpperCase();
        return status === statusFilter.toUpperCase();
      });
    }

    // Search Logic (Order ID, Customer Name, or Email)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => {
        const orderId = order?._id ? order._id.toLowerCase() : '';
        const userName = order?.userId?.name ? order.userId.name.toLowerCase() : '';
        const userEmail = order?.userId?.email ? order.userId.email.toLowerCase() : '';

        return orderId.includes(term) || userName.includes(term) || userEmail.includes(term);
      });
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, allOrders]);

  // Delivery Progress Calculate function
  const calculateDeliveryProgress = (createdAt, currentStatus) => {
    if (currentStatus === 'DELIVERED') return 100;
    if (currentStatus === 'CANCELLED') return 0;
    if (currentStatus === 'PACKED') return 35;
    if (currentStatus === 'SHIPPED') return 70;

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

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const s = (status || 'CONFIRMED').toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return (
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-emerald-100 border border-emerald-400/30">
            <FaCheckCircle className="text-emerald-300" /> Delivered
          </div>
        );
      case 'SHIPPED':
        return (
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-blue-100 border border-blue-400/30">
            <FaShippingFast className="text-blue-300" /> Shipped
          </div>
        );
      case 'PACKED':
        return (
          <div className="inline-flex items-center gap-1.5 bg-purple-500/20 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-purple-100 border border-purple-400/30">
            <FaBoxOpen className="text-purple-300" /> Packed
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="inline-flex items-center gap-1.5 bg-red-500/20 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-red-100 border border-red-400/30">
            <FaTimesCircle className="text-red-300" /> Cancelled
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/20">
            <FaClock className="text-amber-300" /> Confirmed
          </div>
        );
    }
  };

  // Status Change Handler
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !updateStatus) return;

    try {
      const response = await fetch(SummaryApi.updateOrder?.url || '/api/update-order-status', {
        method: SummaryApi.updateOrder?.method || 'POST',
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId: selectedOrder._id,
          orderStatus: updateStatus
        })
      });

      const responseData = await response.json();
      if (responseData.success) {
        setIsModalOpen(false);
        fetchAllOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 px-3 py-5 sm:px-4 sm:py-8 lg:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            All Customer Orders
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manage, track, and update all customer orders in real-time
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by Order ID, Name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${statusFilter === status
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* No Orders Available */}
        {filteredOrders.length === 0 && !loading && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border p-6 sm:p-8 text-center my-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
              <FaBoxOpen className="text-2xl sm:text-3xl text-purple-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              No Orders Found
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              There are no customer orders matching your selected filter or search term.
            </p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12 text-purple-600 font-semibold">
            Loading orders...
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-5 sm:space-y-6">
          {filteredOrders.map((item, index) => {
            const currentStatus = item.orderStatus || 'CONFIRMED';
            const progressPercent = calculateDeliveryProgress(item.createdAt, currentStatus);

            return (
              <div
                key={item._id || index}
                className="bg-white rounded-2xl shadow-md border overflow-hidden"
              >
                {/* Header Section */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-purple-700 to-pink-600 text-white px-4 py-3.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-white/20 font-mono px-2 py-0.5 rounded text-purple-100">
                        #{item._id?.slice(-8) || index + 1}
                      </span>
                      <p className="text-sm sm:text-base font-bold">
                        {moment(item.createdAt).format('LLL')}
                      </p>
                    </div>
                    {/* Customer Info */}
                    <p className="text-xs sm:text-sm text-purple-100 flex items-center gap-1.5 pt-1">
                      <FaUser className="text-xs" />
                      <span>{item.userId?.name || 'Customer'}</span>
                      {item.userId?.email && <span className="text-purple-200">({item.userId.email})</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(currentStatus)}

                    {/* Admin Action Button */}
                    <button
                      onClick={() => {
                        setSelectedOrder(item);
                        setUpdateStatus(currentStatus);
                        setIsModalOpen(true);
                      }}
                      className="bg-white text-purple-700 hover:bg-purple-50 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
                    >
                      <FaEdit /> Change Status
                    </button>
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
                          <div className="w-full sm:w-24 h-32 sm:h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
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
      </div>

      {/* Admin Status Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Update Order Status
            </h3>
            <p className="text-xs text-gray-500 mb-4 font-mono">
              Order ID: #{selectedOrder?._id}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Status
            </label>
            <select
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              className="w-full p-3 border rounded-xl bg-slate-50 text-sm font-semibold mb-6 focus:outline-none focus:border-purple-600"
            >
              <option value="CONFIRMED">CONFIRMED (Order Placed)</option>
              <option value="PACKED">PACKED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border text-gray-600/80 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrderStatus}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;