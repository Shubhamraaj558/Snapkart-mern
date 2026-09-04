import React, { useState } from 'react'
import { CgClose } from "react-icons/cg"
import productCategory from '../helpers/productCategory'
import { FaCloudUploadAlt } from "react-icons/fa"
import uploadImage from '../helpers/uploadImage'
import DisplayImage from './DisplayImage'
import { MdDelete } from "react-icons/md"
import SummaryApi from '../common'
import { toast } from 'react-toastify'


const AdminEditProduct = ({
  onClose,
  productData,
  fetchdata
}) => {
  const [data, setData] = useState({
    ...productData,
    productImage: productData?.productImage || []
  })

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((preve) => ({
      ...preve,
      [name]: value
    }))
  }

  const handleUploadProduct = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploadImageCloudinary = await uploadImage(file)
          return uploadImageCloudinary.url
        })
      )

      setData((preve) => ({
        ...preve,
        productImage: [...preve.productImage, ...uploadedImages]
      }))
    } catch (error) {
      toast.error("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)

    setData((preve) => ({
      ...preve,
      productImage: [...newProductImage]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (responseData.success) {
      toast.success(responseData?.message)
      onClose()
      fetchdata()
    }

    if (responseData.error) {
      toast.error(responseData?.message)
    }
  }

  return (
    <div className='fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl'>
      {/* Full Page Container */}
      <div className='min-h-screen w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 px-4 py-6 lg:px-8 lg:py-8'>
        
        {/* Left - Main Form */}
        <div className='overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/90 shadow-[0_20px_80px_rgba(0,0,0,0.45)]'>
          {/* Header */}
          <div className='sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-900/95 px-6 py-5 backdrop-blur-xl'>
            <div>
              <h2 className='text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent'>
                {/* Edit Product */}
              </h2>
              <p className='mt-1 text-sm text-slate-400'>
                Update product details and pricing
              </p>
            </div>
            <button
              type='button'
              onClick={onClose}
              className='grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl text-slate-300 transition-all hover:bg-red-500/20 hover:text-red-300 hover:scale-105'
            >
              <CgClose />
            </button>
          </div>

          {/* Form Content */}
          <form id="productForm" className='p-6 lg:p-8 max-h-[calc(100vh-200px)] overflow-y-auto' onSubmit={handleSubmit}>
            <div className='grid gap-6'>
              
              {/* Product Basic Info */}
              <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-slate-200'>Product Name</label>
                  <input
                    type='text'
                    name='productName'
                    value={data.productName || ''}
                    onChange={handleOnChange}
                    className='w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-white placeholder-slate-400 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all'
                    placeholder='Enter product name'
                    required
                  />
                </div>

                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-slate-200'>Brand Name</label>
                  <input
                    type='text'
                    name='brandName'
                    value={data.brandName || ''}
                    onChange={handleOnChange}
                    className='w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-white placeholder-slate-400 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all'
                    placeholder='Enter brand name'
                    required
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-slate-200'>Category</label>
                  <select
                    name='category'
                    value={data.category || ''}
                    onChange={handleOnChange}
                    className='w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-white focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all'
                    required
                  >
                    <option value={""} className='text-black'>Select Category</option>
                    {productCategory.map((el, index) => (
                      <option value={el.value} key={el.value + index} className='text-black'>
                        {el.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-slate-200'>Original Price</label>
                  <input
                    type='number'
                    name='price'
                    value={data.price || ''}
                    onChange={handleOnChange}
                    className='w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-white placeholder-slate-400 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all'
                    placeholder='₹ 0'
                    required
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <label className='text-sm font-semibold text-slate-200'>Selling Price</label>
                <input
                  type='number'
                  name='sellingPrice'
                  value={data.sellingPrice || ''}
                  onChange={handleOnChange}
                  className='w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-white placeholder-slate-400 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all'
                  placeholder='₹ 0'
                  required
                />
              </div>

              <div className='space-y-3'>
                <label className='text-sm font-semibold text-slate-200'>Product Description</label>
                <textarea
                  name='description'
                  value={data.description || ''}
                  onChange={handleOnChange}
                  rows={4}
                  className='w-full resize-vertical rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder-slate-400 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all'
                  placeholder='Enter detailed product description...'
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right - Image Management */}
        <div className='hidden lg:block'>
          <div className='sticky top-6 h-fit overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/90 shadow-[0_20px_80px_rgba(0,0,0,0.45)]'>
            
            {/* Images Header */}
            <div className='border-b border-white/10 bg-slate-900/95 px-6 py-5 backdrop-blur-xl'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-bold text-white'>Product Images</h3>
                  <p className='mt-1 text-sm text-slate-400'>
                    {data.productImage?.length || 0} images • Max 8
                  </p>
                </div>
                
                <label htmlFor='uploadImageInput'>
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl border-2 border-dashed border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-300 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/15 hover:scale-105 ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <FaCloudUploadAlt />
                  </div>
                  <input
                    id='uploadImageInput'
                    type='file'
                    className='hidden'
                    onChange={handleUploadProduct}
                    multiple
                    accept='image/*'
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Images Grid */}
            <div className='p-6 max-h-[calc(100vh-300px)] overflow-y-auto'>
              <div className='grid grid-cols-2 gap-4'>
                {data?.productImage?.length > 0 ? (
                  data.productImage.slice(0, 8).map((el, index) => (
                    <div key={el + index} className='group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]'>
                      <img
                        src={el}
                        alt={`Product image ${index + 1}`}
                        className='h-32 w-full cursor-pointer object-cover transition-transform group-hover:scale-105'
                        onClick={() => {
                          setOpenFullScreenImage(true)
                          setFullScreenImage(el)
                        }}
                      />
                      
                      <button
                        type='button'
                        onClick={() => handleDeleteProductImage(index)}
                        className='absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-red-500/90 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-red-600 hover:scale-110 opacity-0 group-hover:opacity-100'
                      >
                        <MdDelete className='text-sm' />
                      </button>
                      
                      <div className='absolute bottom-2 left-2 rounded-full bg-white/20 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm'>
                        {index + 1}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='col-span-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.03] py-12 text-center backdrop-blur-sm'>
                    <FaCloudUploadAlt className='mx-auto h-16 w-16 text-slate-400' />
                    <p className='mt-4 text-lg font-semibold text-slate-300'>No images added</p>
                    <p className='mt-1 text-sm text-slate-500'>Click upload button to add product images</p>
                  </div>
                )}

                {data.productImage?.length >= 8 && (
                  <div className='col-span-2 rounded-2xl border border-orange-400/30 bg-orange-400/5 p-4 text-center'>
                    <p className='text-sm font-medium text-orange-300'>Maximum 8 images reached</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className='border-t border-white/10 bg-gradient-to-r from-slate-900/95 to-slate-800/50 px-6 py-5 backdrop-blur-xl'>
              <button
                type='submit'
                form='productForm'
                disabled={uploading || data.productImage?.length === 0}
                className='w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-cyan-400 disabled:to-blue-500'
              >
                {uploading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {openFullScreenImage && (
        <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )}
    </div>
  )
}

export default AdminEditProduct