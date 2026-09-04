import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { FaCartPlus, FaBolt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(8).fill(null);

  const scrollElement = useRef();
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setData(categoryProduct?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (category) {
      fetchData();
    }
  }, [category]);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 320;
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 320;
  };

  return (
    <div className="container mx-auto px-4 my-8">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-100 via-rose-50 to-pink-100 px-4 py-6 sm:px-5 md:px-6">
        {/* background blur blobs */}
        <div className="pointer-events-none absolute -top-10 -left-10 h-36 w-36 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-rose-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/3 h-28 w-28 rounded-full bg-purple-300/10 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
              {heading}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Handpicked products in {category}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-md backdrop-blur-md transition hover:bg-slate-900 hover:text-white"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={scrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-md backdrop-blur-md transition hover:bg-slate-900 hover:text-white"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={scrollElement}
          className="relative z-10 flex gap-4 overflow-x-auto scrollbar-none scroll-smooth"
        >
          {loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className="w-full min-w-[220px] max-w-[220px] sm:min-w-[240px] sm:max-w-[240px] md:min-w-[260px] md:max-w-[260px] overflow-hidden rounded-3xl border border-white/50 bg-white/60 shadow-lg backdrop-blur-md"
                >
                  <div className="h-44 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200 animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-3 w-14 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-3 w-12 rounded-full bg-slate-200 animate-pulse" />
                    </div>
                    <div className="h-9 rounded-full bg-slate-200 animate-pulse" />
                  </div>
                </div>
              ))
            : data.map((product) => (
                <Link
                  key={product?._id}
                  to={`/product/${product?._id}`}
                  className="group w-full min-w-[220px] max-w-[220px] sm:min-w-[240px] sm:max-w-[240px] md:min-w-[260px] md:max-w-[260px] overflow-hidden rounded-3xl border border-white/50 bg-white/65 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* Image box */}
                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-white/70 via-rose-50 to-pink-50 p-4">
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 shadow-sm">
                      <FaBolt className="text-[9px]" />
                      Trending
                    </span>

                    <img
                      src={product?.productImage?.[0]}
                      alt={product?.productName}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h2 className="min-h-[42px] line-clamp-2 text-sm font-semibold leading-snug text-slate-800 sm:text-base">
                      {product?.productName}
                    </h2>

                    <p className="mt-1 text-xs capitalize text-slate-500 sm:text-sm">
                      {product?.category}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-rose-600 sm:text-base">
                        {displayINRCurrency(product?.sellingPrice)}
                      </p>
                      <p className="text-xs text-slate-400 line-through sm:text-sm">
                        {displayINRCurrency(product?.price)}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product?._id)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:from-rose-500 hover:to-pink-500 sm:text-sm"
                    >
                      <FaCartPlus className="text-xs" />
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalCardProduct;