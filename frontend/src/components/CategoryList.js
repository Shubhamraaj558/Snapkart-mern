import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async () => {
        setLoading(true)
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    }

    useEffect(() => {
        fetchCategoryProduct()
    }, [])

    return (
        <div className='container mx-auto p-4'>
            <div className='flex items-center gap-5 justify-between overflow-scroll scrollbar-none'>

                {
                    loading ? (
                        categoryLoading.map((el, index) => (
                            <div
                                className='h-16 w-16 md:h-20 md:w-20 rounded-full bg-slate-200 animate-pulse'
                                key={"categoryLoading" + index}
                            />
                        ))
                    ) : (
                        categoryProduct.map((product) => {
                            return (
                                <Link
                                    to={"/product-category?category=" + product?.category}
                                    className='cursor-pointer'
                                    key={product?.category}
                                >

                                    {/* 🔥 SMALLER RAINBOW RING */}
                                    <div className='w-16 h-16 md:w-20 md:h-20 relative'>

                                        {/* rotating multicolor ring */}
                                        <div className='absolute inset-0 rounded-full animate-spin-slow
                                            bg-[conic-gradient(red,yellow,green,blue,purple,orange,red)]'>
                                        </div>

                                        {/* inner circle */}
                                        <div className='absolute inset-[3px] rounded-full bg-slate-200 flex items-center justify-center overflow-hidden
                                            border-2 border-transparent hover:border-green-500 transition-all duration-300'>

                                            <img
                                                src={product?.productImage[0]}
                                                alt={product?.category}
                                                className='w-full h-full object-contain scale-90 hover:scale-100 transition-all duration-300'
                                            />

                                        </div>
                                    </div>

                                    <p className='text-center text-sm md:text-base capitalize'>
                                        {product?.category}
                                    </p>

                                </Link>
                            )
                        })
                    )
                }

            </div>
        </div>
    )
}

export default CategoryList