import React, { useState } from 'react'
import { CgClose } from "react-icons/cg"
import productCategory from '../helpers/productCategory'
import { FaCloudUploadAlt } from "react-icons/fa"
import uploadImage from '../helpers/uploadImage'
import DisplayImage from './DisplayImage'
import { MdDelete } from "react-icons/md"
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const UploadProduct = ({
  onClose,
  fetchData
}) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadProduct = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploadImageCloudinary = await uploadImage(file)
          return uploadImageCloudinary.url
        })
      )

      setData((preve) => {
        return {
          ...preve,
          productImage: [...preve.productImage, ...uploadedImages]
        }
      })
    } catch (error) {
      toast.error("Image upload failed")
    }
  }

  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage]
    newProductImage.splice(index, 1)

    setData((preve) => {
      return {
        ...preve,
        productImage: [...newProductImage]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
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
      fetchData()
    }

    if (responseData.error) {
      toast.error(responseData?.message)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md'>
      <div className='w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-[0_20px_80px_rgba(0,0,0,0.45)]'>

        {/* Header */}
        <div className='flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-xl'>
          <div>
            <h2 className='text-xl font-bold text-white'>Upload Product</h2>
            <p className='mt-1 text-sm text-slate-400'>
              Add a new product with details, pricing and images
            </p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-red-500/15 hover:text-red-300'
          >
            <CgClose />
          </button>
        </div>

        {/* Form */}
        <form
          className='grid max-h-[82vh] gap-5 overflow-y-auto p-6'
          onSubmit={handleSubmit}
        >
          <div className='grid gap-5 md:grid-cols-2'>
            <div className='space-y-2'>
              <label htmlFor='productName' className='text-sm font-medium text-slate-200'>
                Product Name
              </label>
              <input
                type='text'
                id='productName'
                placeholder='Enter product name'
                name='productName'
                value={data.productName}
                onChange={handleOnChange}
                className='w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/[0.07]'
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='brandName' className='text-sm font-medium text-slate-200'>
                Brand Name
              </label>
              <input
                type='text'
                id='brandName'
                placeholder='Enter brand name'
                value={data.brandName}
                name='brandName'
                onChange={handleOnChange}
                className='w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/[0.07]'
                required
              />
            </div>
          </div>

          <div className='grid gap-5 md:grid-cols-2'>
            <div className='space-y-2'>
              <label htmlFor='category' className='text-sm font-medium text-slate-200'>
                Category
              </label>
              <select
                required
                value={data.category}
                name='category'
                onChange={handleOnChange}
                className='w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40 focus:bg-white/[0.07]'
              >
                <option value={""} className='text-black'>Select Category</option>
                {
                  productCategory.map((el, index) => {
                    return (
                      <option value={el.value} key={el.value + index} className='text-black'>
                        {el.label}
                      </option>
                    )
                  })
                }
              </select>
            </div>

            <div className='space-y-2'>
              <label htmlFor='price' className='text-sm font-medium text-slate-200'>
                Price
              </label>
              <input
                type='number'
                id='price'
                placeholder='Enter original price'
                value={data.price}
                name='price'
                onChange={handleOnChange}
                className='w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/[0.07]'
                required
              />
            </div>
          </div>

          <div className='grid gap-5 md:grid-cols-2'>
            <div className='space-y-2'>
              <label htmlFor='sellingPrice' className='text-sm font-medium text-slate-200'>
                Selling Price
              </label>
              <input
                type='number'
                id='sellingPrice'
                placeholder='Enter selling price'
                value={data.sellingPrice}
                name='sellingPrice'
                onChange={handleOnChange}
                className='w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/[0.07]'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-slate-200'>
                Upload Images
              </label>

              <label htmlFor='uploadImageInput'>
                <div className='group flex h-[116px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 transition hover:border-cyan-300/40 hover:bg-cyan-500/10'>
                  <span className='text-4xl text-cyan-300 transition group-hover:scale-110'>
                    <FaCloudUploadAlt />
                  </span>
                  <p className='mt-2 text-sm font-medium text-slate-200'>
                    Upload Product Images
                  </p>
                  <p className='mt-1 text-xs text-slate-400'>
                    You can select multiple images at once
                  </p>
                  <input
                    type='file'
                    id='uploadImageInput'
                    className='hidden'
                    onChange={handleUploadProduct}
                    multiple
                    accept='image/*'
                  />
                </div>
              </label>
            </div>
          </div>

          <div className='space-y-3'>
            <label className='text-sm font-medium text-slate-200'>
              Product Images Preview
            </label>

            {
              data?.productImage[0] ? (
                <div className='flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                  {
                    data.productImage.map((el, index) => {
                      return (
                        <div key={el + index} className='group relative'>
                          <img
                            src={el}
                            alt={el}
                            width={90}
                            height={90}
                            className='h-[90px] w-[90px] rounded-2xl border border-white/10 bg-slate-800 object-cover cursor-pointer transition group-hover:scale-[1.03]'
                            onClick={() => {
                              setOpenFullScreenImage(true)
                              setFullScreenImage(el)
                            }}
                          />

                          <button
                            type='button'
                            className='absolute -right-2 -top-2 hidden rounded-full bg-red-600 p-2 text-white shadow-lg transition hover:bg-red-700 group-hover:block'
                            onClick={() => handleDeleteProductImage(index)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                <div className='rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300'>
                  Please upload at least one product image.
                </div>
              )
            }
          </div>

          <div className='space-y-2'>
            <label htmlFor='description' className='text-sm font-medium text-slate-200'>
              Description
            </label>
            <textarea
              id='description'
              className='min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/[0.07]'
              placeholder='Enter product description'
              rows={4}
              onChange={handleOnChange}
              name='description'
              value={data.description}
            />
          </div>

          <div className='sticky bottom-0 -mx-6 mt-2 flex justify-end gap-3 border-t border-white/10 bg-slate-950/95 px-6 py-4 backdrop-blur-xl'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white'
            >
              Cancel
            </button>

            <button className='rounded-2xl border border-orange-400/30 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:from-orange-400 hover:to-red-400'>
              Upload Product
            </button>
          </div>
        </form>
      </div>

      {
        openFullScreenImage && (
          <DisplayImage
            onClose={() => setOpenFullScreenImage(false)}
            imgUrl={fullScreenImage}
          />
        )
      }
    </div>
  )
}

export default UploadProduct