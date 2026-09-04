import React, { useEffect, useState, useMemo } from 'react'
import SummaryApi from '../common'
import moment from 'moment'
import displayINRCurrency from '../helpers/displayCurrency'

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    'pending': { label: 'Pending', color: 'orange', bg: 'bg-orange-400/10 border-orange-400/30' },
    'confirmed': { label: 'Confirmed', color: 'emerald', bg: 'bg-emerald-400/10 border-emerald-400/30' },
    'shipped': { label: 'Shipped', color: 'blue', bg: 'bg-blue-400/10 border-blue-400/30' },
    'delivered': { label: 'Delivered', color: 'green', bg: 'bg-green-400/10 border-green-400/30' },
    'cancelled': { label: 'Cancelled', color: 'red', bg: 'bg-red-400/10 border-red-400/30' },
    default: { label: status || 'Unknown', color: 'slate', bg: 'bg-slate-400/10 border-slate-400/30' }
  }

  const config = statusConfig[status?.toLowerCase()] || statusConfig.default

  return (
    <div className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border text-${config.color}-100 ${config.bg}`}>
      {config.label}
    </div>
  )
}

const AllOrder = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(SummaryApi.allOrder.url, {
        method: SummaryApi.allOrder.method,
        credentials: 'include'
      })

      const responseData = await response.json()
      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      console.error("Order fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetails()
  }, [])

  const totalOrders = data.length
  const totalRevenue = useMemo(() => 
    data.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0)
  , [data])

  if (loading) {
    return (
      <div className="min-h-[400px] grid place-items-center rounded-[24px] bg-white/[0.04] backdrop-blur-xl border border-white/8 p-12">
        <div className="text-center space-y-4">
          <div className="inline-block w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-lg text-slate-300 font-medium">Loading Orders...</p>
          <p className="text-sm text-slate-400">Fetching latest order data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Orders Dashboard
          </h1>
          <p className="mt-2 text-slate-400 text-lg">Manage all customer orders and track fulfillment</p>
        </div>
        
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
            <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Total Orders 📦</p>
            <p className="text-3xl font-black text-white mt-2">{totalOrders.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20 hover:from-emerald-500/30 transition-all">
            <p className="text-sm text-emerald-200 uppercase tracking-wider font-semibold">Total Revenue </p>
            <p className="text-1.5xl font-black text-emerald-100 mt-2">
              {displayINRCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {data.length === 0 ? (
        <div className="min-h-[400px] grid place-items-center rounded-[28px] bg-gradient-to-br from-slate-800/50 to-slate-900/20 backdrop-blur-2xl border border-white/8 p-16 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-28 h-28 mx-auto bg-white/5 rounded-3xl grid place-items-center">
              <svg className="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-4L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">No Orders Yet</h3>
              <p className="text-slate-400 text-lg">No orders have been placed. Orders will appear here once customers start shopping.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          {data.map((order, index) => (
            <div
              key={`${order._id || order.userId}-${index}`}
              className="group bg-white/[0.06] backdrop-blur-xl hover:bg-white/[0.09] border border-white/10 rounded-[24px] p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 grid place-items-center">
                    <svg className="w-7 h-7 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white truncate max-w-md">
                      Order #{order._id?.slice(-8).toUpperCase() || `ORD-${index + 1}`}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {moment(order.createdAt).format('MMM DD, YYYY • hh:mm A')}
                    </p>
                  </div>
                </div>
                
                <OrderStatusBadge status={order.paymentDetails?.payment_status} />
              </div>

              {/* Content */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Products */}
                <div className="lg:col-span-2 space-y-3">
                  {order?.productDetails?.map((product, pIndex) => (
                    <div
                      key={`${product.productId}-${pIndex}`}
                      className="group/product flex gap-4 p-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:bg-white/[0.08] transition-all hover:shadow-lg"
                    >
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/20 border border-white/10 w-28 flex-shrink-0">
                        <img
                          src={product.image?.[0] || '/api/placeholder/112/112'}
                          alt={product.name ?? "Product"}
                          className="w-28 h-28 object-contain p-3 transition-transform group-hover/product:scale-105"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-lg truncate max-w-xs mb-1.5">
                          {product.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-200 rounded-full font-medium">
                            {displayINRCurrency(product.price)}
                          </span>
                          <span className="text-slate-400">
                            Qty: <span className="font-semibold text-white">{product.quantity}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-5">
                  <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                    <h5 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                      💳 Payment
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-300">
                        <span>Method:</span>
                        <span className="font-medium text-white">
                          {order.paymentDetails?.payment_method_type?.[0]?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/10">
                        <span>Status:</span>
                        <OrderStatusBadge status={order.paymentDetails?.payment_status} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                    <h5 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                      🚚 Shipping
                    </h5>
                    <div className="space-y-2 text-sm text-slate-300">
                      {order.shipping_options?.map((shipping, sIndex) => (
                        <div key={sIndex} className="flex justify-between">
                          <span>Shipping:</span>
                          <span className="font-medium text-emerald-200">
                            {displayINRCurrency(shipping.shipping_amount)}
                          </span>
                        </div>
                      )) || <div className="text-center py-3 text-slate-500">No shipping info</div>}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/15 to-green-500/10 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/20 text-right">
                    <div className="text-2xl font-black text-emerald-100">
                      {displayINRCurrency(order.totalAmount)}
                    </div>
                    <p className="text-sm text-emerald-200 mt-1">Total Amount</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllOrder