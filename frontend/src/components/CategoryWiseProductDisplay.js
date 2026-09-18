import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';

const CategroyWiseProductDisplay = ({ category, heading }) => {
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
    fetchData();
  }, [category]);

  const scrollRight = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft += 260;
    }
  };

  const scrollLeft = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft -= 260;
    }
  };

  return (
    <section className="container mx-auto px-3 my-6 text-xs sm:text-sm">
      {/* Header */}
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-800 tracking-tight">
            {heading}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-light mt-0.5">
            Explore top picks in <span className="capitalize font-medium">{heading}</span> · {data.length} items
          </p>
        </div>

        {/* Desktop arrows */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={scrollLeft}
            aria-label="Scroll Left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-red-50 hover:text-red-600"
          >
            <FaAngleLeft size={12} />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll Right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-red-50 hover:text-red-600"
          >
            <FaAngleRight size={12} />
          </button>
        </div>
      </div>

      {/* Product row */}
      <div
        ref={scrollElement}
        className="flex gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 snap-x snap-mandatory"
      >
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="snap-start min-w-[200px] max-w-[200px] sm:min-w-[220px] sm:max-w-[220px] md:min-w-[240px] md:max-w-[240px] rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden"
              >
                <div className="h-32 sm:h-36 bg-slate-100 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-2.5 w-1/3 rounded-full bg-slate-200 animate-pulse" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-3.5 w-16 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-3.5 w-12 rounded-full bg-slate-200 animate-pulse" />
                  </div>
                  <div className="h-7 w-full rounded-full bg-slate-200 animate-pulse mt-1" />
                </div>
              </div>
            ))
          : data.map((product) => (
              <Link
                key={product?._id}
                to={`/product/${product?._id}`}
                onClick={scrollTop}
                className="group snap-start min-w-[200px] max-w-[200px] sm:min-w-[220px] sm:max-w-[220px] md:min-w-[240px] md:max-w-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative flex h-32 sm:h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 p-3">
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.productName}
                    className="h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-red-600 shadow-xs">
                    {product?.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h2 className="line-clamp-1 text-xs sm:text-sm font-semibold text-slate-800">
                    {product?.productName}
                  </h2>

                  <p className="mt-0.5 text-[10px] sm:text-[11px] capitalize text-slate-500 font-light">
                    Premium quality • {product?.category}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-black text-red-600">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>
                    <p className="text-[11px] text-slate-400 line-through">
                      {displayINRCurrency(product?.price)}
                    </p>
                  </div>

                  <button
                    className="mt-2.5 w-full rounded-full bg-red-600 px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-white transition hover:bg-red-700 active:scale-[0.98] shadow-xs"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
      </div>

      {/* Mobile arrows */}
      {!loading && data.length > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2.5 md:hidden">
          <button
            onClick={scrollLeft}
            aria-label="Scroll Left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-red-50 hover:text-red-600"
          >
            <FaAngleLeft size={12} />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll Right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-red-50 hover:text-red-600"
          >
            <FaAngleRight size={12} />
          </button>
        </div>
      )}
    </section>
  );
};

export default CategroyWiseProductDisplay;