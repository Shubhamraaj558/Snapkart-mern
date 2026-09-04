import React, { useEffect, useMemo, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProduct, setAllProduct] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.allProduct.url)
      const dataResponse = await response.json()
      setAllProduct(dataResponse?.data || [])
    } catch (error) {
      console.error("Failed to fetch products", error)
      setAllProduct([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProduct()
  }, [])

  const totalProducts = allProduct.length

  const inStockProducts = useMemo(() => {
    return allProduct.filter(
      product => (product?.countInStock || product?.stock || product?.quantity || 0) > 0
    ).length
  }, [allProduct])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="sticky top-0 z-20 rounded-xl border border-white/10 bg-white/[0.04] shadow-lg backdrop-blur-xl">
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          <div>
            <h2 className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-xl font-bold text-transparent lg:text-2xl">
              All Products
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage product listings, inventory and uploads
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-3">
              <div className="min-w-[120px] rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Products
                </p>
                <p className="mt-1 text-2xl font-black text-white">
                  {totalProducts}
                </p>
              </div>

              <div className="min-w-[120px] rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  In Stock
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-100">
                  {inStockProducts}
                </p>
              </div>
            </div>

            <button
              className="rounded-xl border border-orange-400/30 bg-gradient-to-r from-orange-500/15 to-red-500/10 px-4 py-3 text-sm font-semibold text-orange-100 shadow-md transition-all hover:scale-[1.02] hover:border-orange-300/40 hover:bg-orange-500/20"
              onClick={() => setOpenUploadProduct(true)}
              aria-label="Open Upload Product Form"
            >
              + Upload Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] shadow-inner backdrop-blur-xl">
        {loading ? (
          <div className="grid min-h-[260px] place-items-center p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
              <p className="text-base font-medium text-slate-300">Loading products...</p>
              <p className="mt-1 text-xs text-slate-500">Please wait a moment</p>
            </div>
          </div>
        ) : allProduct.length === 0 ? (
          <div className="grid min-h-[260px] place-items-center p-8">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-white/5">
                <svg className="h-10 w-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V7a2 2 0 00-2-2h-3V3H9v2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="mt-2 text-sm text-slate-400">
                Start by uploading your first product to populate the catalog.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {allProduct.map(product => (
              <div
                key={product._id || product.id}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-2 transition-all hover:bg-white/[0.05] hover:shadow-lg"
              >
                <AdminProductCard
                  data={product}
                  fetchdata={fetchAllProduct}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {openUploadProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-900/95 px-5 py-4 backdrop-blur-xl">
              <div>
                <h3 className="text-lg font-bold text-white">Upload Product</h3>
                <p className="text-xs text-slate-400">Add a new product to your store</p>
              </div>

              <button
                onClick={() => setOpenUploadProduct(false)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-lg font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close Upload Product"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
              <UploadProduct
                onClose={() => setOpenUploadProduct(false)}
                fetchData={fetchAllProduct}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllProducts