import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaClock,
  FaFileCsv,
  FaPrint,
  FaChartLine,
  FaFileInvoice,
  FaShoppingBag
} from 'react-icons/fa';

const AllOrders = () => {
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

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

  // Filter and Search Logic
  useEffect(() => {
    let result = [...allOrders];

    if (statusFilter !== 'ALL') {
      result = result.filter(order => {
        const status = (order?.orderStatus || 'CONFIRMED').toUpperCase();
        return status === statusFilter.toUpperCase();
      });
    }

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
    setCurrentPage(1);
  }, [searchTerm, statusFilter, allOrders]);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Statistics calculation
  const totalRevenue = allOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const deliveredCount = allOrders.filter(o => (o.orderStatus || '').toUpperCase() === 'DELIVERED').length;
  const pendingCount = allOrders.filter(o => {
    const s = (o.orderStatus || 'CONFIRMED').toUpperCase();
    return s !== 'DELIVERED' && s !== 'CANCELLED';
  }).length;

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredOrders.length === 0) return alert('No orders to export!');

    const headers = ['Order ID', 'Customer Name', 'Email', 'Status', 'Total Amount (INR)', 'Date'];
    const rows = filteredOrders.map(order => [
      order._id,
      order.userId?.name || order.shipping_address?.name || 'N/A',
      order.userId?.email || 'N/A',
      order.orderStatus || 'CONFIRMED',
      order.totalAmount || 0,
      moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Snapkart_Orders_${moment().format('YYYY-MM-DD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Invoice Function
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
            .details { margin-bottom: 20px; font-size: 14px; }
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
            <p>Order ID: #${order._id}</p>
            <p>Date: ${moment(order.createdAt).format('LLL')}</p>
          </div>
          <div class="details">
            <strong>Customer Name:</strong> ${address.name || order.userId?.name || 'N/A'}<br/>
            <strong>Shipping Address:</strong> ${address.address || 'N/A'}, Pincode: ${address.pincode || 'N/A'}<br/>
            <strong>Phone:</strong> ${address.phone || 'N/A'}<br/>
            <strong>Status:</strong> ${order.orderStatus || 'CONFIRMED'}
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price (INR)</th>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-slate-100 px-3 py-5 sm:px-4 sm:py-8 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <FaShoppingBag className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
                SNAPKART ADMIN
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage, track, and update all customer orders in real-time
              </p>
            </div>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md transition"
          >
            <FaFileCsv className="text-lg" /> Export CSV
          </button>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Total Revenue</p>
              <h3 className="text-xl font-black text-cyan-400 mt-1">{displayINRCurrency(totalRevenue)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FaChartLine className="text-xl" />
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Delivered Orders</p>
              <h3 className="text-xl font-black text-emerald-400 mt-1">{deliveredCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FaCheckCircle className="text-xl" />
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Active/Pending</p>
              <h3 className="text-xl font-black text-amber-400 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FaClock className="text-xl" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-800 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by Order ID, Name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${statusFilter === status
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="max-w-xl mx-auto bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 text-center my-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <FaBoxOpen className="text-2xl sm:text-3xl text-purple-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">No Orders Found</h2>
            <p className="text-sm sm:text-base text-slate-400">
              There are no customer orders matching your selected filter or search term.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-purple-400 font-semibold">Loading orders...</div>
        )}

        <div className="space-y-5 sm:space-y-6">
          {currentOrders.map((item, index) => {
            const currentStatus = item.orderStatus || 'CONFIRMED';
            const progressPercent = calculateDeliveryProgress(item.createdAt, currentStatus);
            const addressObj = item.shipping_address || {};

            return (
              <div key={item._id || index} className="bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-purple-900 via-slate-900 to-slate-900 text-white px-4 py-3.5 border-b border-slate-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-800 border border-slate-700 font-mono px-2 py-0.5 rounded text-cyan-300">
                        #{item._id?.slice(-8) || index + 1}
                      </span>
                      <p className="text-sm sm:text-base font-bold text-slate-200">
                        {moment(item.createdAt).format('LLL')}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 pt-1">
                      <FaUser className="text-xs text-purple-400" />
                      <span>{item.userId?.name || item.userName || addressObj.name || 'Customer'}</span>
                      {item.userId?.email && <span className="text-slate-500">({item.userId.email})</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(currentStatus)}
                    <button
                      onClick={() => navigate(`/invoice/${item._id}`)}
                      className="bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      title="View Professional Invoice"
                    >
                      <FaFileInvoice /> Invoice
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(item)}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      title="Print Invoice"
                    >
                      <FaPrint /> Print
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(item);
                        setUpdateStatus(currentStatus);
                        setIsModalOpen(true);
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-md"
                    >
                      <FaEdit /> Status
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-950/50 border-b border-slate-800 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <FaTruck className="text-cyan-400" /> Estimated Delivery
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-cyan-400">
                      {moment(item.createdAt).add(5, 'days').format('LL')}
                    </span>
                  </div>

                  <div className="relative w-full bg-slate-800 h-2.5 rounded-full overflow-hidden my-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-4 text-center mt-3 text-xs sm:text-sm">
                    <div className="flex flex-col items-center text-cyan-400 font-semibold">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-1">
                        <FaBox className="text-cyan-400 text-xs sm:text-sm" />
                      </div>
                      <span>Order Placed</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 35 ? 'text-cyan-400 font-semibold' : 'text-slate-600'}`}>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 ${progressPercent >= 35 ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-slate-800'}`}>
                        <FaBoxOpen className={progressPercent >= 35 ? 'text-cyan-400' : 'text-slate-600'} />
                      </div>
                      <span>Packed</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 70 ? 'text-cyan-400 font-semibold' : 'text-slate-600'}`}>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 ${progressPercent >= 70 ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-slate-800'}`}>
                        <FaShippingFast className={progressPercent >= 70 ? 'text-cyan-400' : 'text-slate-600'} />
                      </div>
                      <span>Shipped</span>
                    </div>

                    <div className={`flex flex-col items-center ${progressPercent >= 100 ? 'text-emerald-400 font-semibold' : 'text-slate-600'}`}>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 ${progressPercent >= 100 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-800'}`}>
                        <FaHome className={progressPercent >= 100 ? 'text-emerald-400' : 'text-slate-600'} />
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
                        <div key={product.productId + pIndex} className="flex flex-col xs:flex-row sm:flex-row gap-3 bg-slate-950/40 border border-slate-800 rounded-xl p-3">
                          <div className="w-full sm:w-24 h-32 sm:h-24 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2 flex-shrink-0 border border-slate-800">
                            <img
                              src={product.image?.[0]}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-slate-200 line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                              <p className="text-base font-bold text-cyan-400">
                                {displayINRCurrency(product.price)}
                              </p>
                              <p className="text-sm text-slate-400">Quantity: {product.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Details Side Panel */}
                    <div className="space-y-3">
                      {/* Payment Details */}
                      <div className="bg-purple-950/20 border border-purple-900/40 rounded-xl p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-2">Payment Details</h3>
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold text-slate-400">Method:</span>{' '}
                          {item.paymentDetails?.payment_method_type?.[0] || item.paymentMethod || 'Online / Prepaid'}
                        </p>
                        <p className="text-sm text-slate-300 mt-1">
                          <span className="font-semibold text-slate-400">Status:</span>{' '}
                          <span className="capitalize font-medium text-emerald-400">
                            {item.paymentDetails?.payment_status || 'Paid'}
                          </span>
                        </p>
                      </div>

                      {/* Shipping Details */}
                      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3 sm:p-4 space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <FaTruck className="text-emerald-400 text-base" />
                          <h3 className="text-sm sm:text-base font-bold text-slate-200">Shipping Details</h3>
                        </div>

                        <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-sm">
                          <div className="flex items-start gap-1.5 text-sm text-slate-300">
                            <FaMapMarkerAlt className="text-emerald-400 mt-1 flex-shrink-0" />
                            <div className="w-full">
                              <p className="font-semibold text-slate-200 mb-1">Delivery Address:</p>
                              {Object.keys(addressObj).length > 0 ? (
                                <div className="text-slate-400 text-xs sm:text-sm space-y-0.5">
                                  <p className="font-bold text-slate-200">{addressObj.name || 'N/A'}</p>
                                  <p>
                                    <span className="font-medium text-slate-300">Address:</span> {addressObj.address || 'N/A'}
                                  </p>
                                  <p>
                                    <span className="font-medium text-slate-300">Pincode:</span> {addressObj.pincode || 'N/A'}
                                  </p>
                                  {addressObj.phone && (
                                    <p>
                                      <span className="font-medium text-slate-300">Phone:</span> {addressObj.phone}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-slate-500 italic">No address details available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm sm:text-base font-bold text-slate-200">Total Amount</span>
                          <span className="text-base sm:text-xl font-black text-cyan-400">
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition ${currentPage === page
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Admin Status Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Update Order Status</h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">Order ID: #{selectedOrder?._id}</p>

            <label className="block text-sm font-medium text-slate-300 mb-2">Select New Status</label>
            <select
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              className="w-full p-3 border border-slate-700 rounded-xl bg-slate-950 text-slate-100 text-sm font-semibold mb-6 focus:outline-none focus:border-purple-500"
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
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrderStatus}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition shadow-md"
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