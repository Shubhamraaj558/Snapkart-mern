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
    scrollElement.current.scrollLeft += 280;
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 280;
  };

  return (
    <div className="container mx-auto px-3 my-5 text-xs sm:text-sm">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-rose-50 to-pink-100 px-3 py-4 sm:px-4 sm:py-5 md:px-5">
        
        {/* Background blur blobs */}
        <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 rounded-full bg-rose-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/3 h-24 w-24 rounded-full bg-purple-300/10 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-800 tracking-tight">
              {heading}
            </h2>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-600 font-light">
              Handpicked products in <span className="capitalize font-medium">{category}</span>
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={scrollLeft}
              aria-label="Scroll Left"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-slate-900 hover:text-white"
            >
              <FaAngleLeft size={12} />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll Right"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-slate-900 hover:text-white"
            >
              <FaAngleRight size={12} />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={scrollElement}
          className="relative z-10 flex gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1"
        >
          {loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className="w-full min-w-[190px] max-w-[190px] sm:min-w-[210px] sm:max-w-[210px] md:min-w-[230px] md:max-w-[230px] overflow-hidden rounded-2xl border border-white/50 bg-white/65 shadow-md backdrop-blur-md"
                >
                  <div className="h-36 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                  <div className="space-y-2.5 p-3">
                    <div className="h-3.5 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200 animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-3 w-12 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-3 w-10 rounded-full bg-slate-200 animate-pulse" />
                    </div>
                    <div className="h-8 rounded-full bg-slate-200 animate-pulse" />
                  </div>
                </div>
              ))
            : data.map((product) => (
                <Link
                  key={product?._id}
                  to={`/product/${product?._id}`}
                  className="group w-full min-w-[190px] max-w-[190px] sm:min-w-[210px] sm:max-w-[210px] md:min-w-[230px] md:max-w-[230px] overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  {/* Image box */}
                  <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-white/80 via-rose-50/50 to-pink-50/50 p-3">
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 shadow-xs border border-amber-200/50">
                      <FaBolt size={8} />
                      Trending
                    </span>

                    <img
                      src={product?.productImage?.[0]}
                      alt={product?.productName}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="min-h-[36px] line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-slate-800">
                        {product?.productName}
                      </h2>

                      <p className="mt-1 text-[11px] capitalize text-slate-500 font-light">
                        {product?.category}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <p className="text-xs sm:text-sm font-black text-rose-600">
                          {displayINRCurrency(product?.sellingPrice)}
                        </p>
                        <p className="text-[11px] text-slate-400 line-through">
                          {displayINRCurrency(product?.price)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product?._id)}
                      className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-3 py-2 text-[11px] sm:text-xs font-semibold text-white transition hover:from-rose-500 hover:to-pink-500 shadow-sm"
                    >
                      <FaCartPlus size={11} />
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